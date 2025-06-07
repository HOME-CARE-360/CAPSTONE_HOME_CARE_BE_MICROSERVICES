import {
    HttpException,
    Injectable,
    UnauthorizedException,

} from '@nestjs/common'


import {
    ForgotPasswordBodyType,
    LoginBodyType,
    RefreshTokenBodyType,
    RegisterBodyType,
    RegisterProviderBodyType,
    SendOTPBodyType,
} from 'libs/common/src/request-response-type/auth/auth.model'



import {
    EmailAlreadyExistsException,
    EmailNotFoundException,
    FailedToSendOTPException,
    InvalidOTPException,
    InvalidPasswordException,
    InvalidTOTPAndCodeException,
    OTPExpiredException,
    RefreshTokenRevokedException,
    ServiceProviderAlreadyExistsException,
} from './auth.error'




import { addMilliseconds } from 'date-fns'
import ms from 'ms'

import { AuthReponsitory } from './auth.repo'


import { HashingService } from 'libs/common/src/services/hashing.service'
import { TokenService } from 'libs/common/src/services/token.service'
import { SharedUserRepository } from 'libs/common/src/repositories/shared-user.repo'
import { EmailService } from 'libs/common/src/services/email.service'
import { TwoFactorService } from 'libs/common/src/services/2fa.service'
import { SharedRoleRepository } from 'libs/common/src/repositories/shared-role.repo'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'libs/common/src/constants/auth.constant'

import { AccessTokenPayloadCreate } from 'libs/common/src/types/jwt.type'
import { VerificationStatusConst } from 'libs/common/src/constants/common.constants'
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'libs/common/helpers'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthReponsitory,
        private readonly sharedUser: SharedUserRepository,
        private readonly emailService: EmailService,
        private readonly twoFactorService: TwoFactorService,
        private readonly rolesService: SharedRoleRepository,
        private configService: ConfigService
    ) { }

    async validateVerificationCode({
        email,
        code,
        type,
    }: {
        email: string
        code: string
        type: TypeOfVerificationCodeType
    }) {
        const verificationCode = await this.authRepository.findUniqueVerificationCode({
            email_code_type: { email, type, code },
        })

        if (verificationCode?.code !== code) throw InvalidOTPException
        if (verificationCode.expiresAt < new Date()) throw OTPExpiredException

        return verificationCode
    }

    async register(body: RegisterBodyType) {
        try {
            const verificationCode = await this.validateVerificationCode({
                email: body.email,
                type: TypeOfVerificationCode.REGISTER,
                code: body.code,
            })

            if (verificationCode.expiresAt < new Date()) {
                throw InvalidOTPException
            }

            const hashedPassword = await this.hashingService.hash(body.password)
            const clientRole = await this.rolesService.getCustomerRoleId()

            const [user] = await Promise.all([
                this.authRepository.createUser({
                    email: body.email,
                    password: hashedPassword,
                    roles: [clientRole],
                    name: body.name,
                    phone: body.phone,
                }),
                this.authRepository.deleteVerificationCode({
                    email_code_type: {
                        email: body.email,
                        type: TypeOfVerificationCode.REGISTER,
                        code: body.code,
                    },
                }),
            ])

            return {
                message: 'Register successfully',
                data: user,
            }
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw EmailAlreadyExistsException
            }
            throw error
        }
    }

    async sendOTP(body: SendOTPBodyType) {
        const user = await this.sharedUser.findUnique({ email: body.email })

        if (user && body.type === TypeOfVerificationCode.REGISTER) {
            throw EmailAlreadyExistsException
        }
        if (!user && body.type === TypeOfVerificationCode.FORGOT_PASSWORD) {
            throw EmailNotFoundException
        }

        const code = generateOTP()
        await this.authRepository.createVerificationCode({
            email: body.email,
            type: body.type,
            code,
            expiresAt: addMilliseconds(new Date(), ms(this.configService.get("OTP_EXPIRES_IN"))),
        })

        const { error } = await this.emailService.sendOTP({ email: body.email, otp: code })
        if (error) throw FailedToSendOTPException

        return {
            message: 'OTP sent successfully',
        }
    }

    async login(body: LoginBodyType & { userAgent: string; ip: string }) {
        const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email })
        if (!user) throw EmailNotFoundException

        const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
        if (!isPasswordMatch) {
            throw InvalidPasswordException

        }

        if (user.totpSecret) {
            if (!body.totpCode && !body.code) throw InvalidTOTPAndCodeException

            if (body.totpCode) {
                const isValid = this.twoFactorService.verifyTOTP({
                    email: user.email,
                    secret: user.totpSecret,
                    token: body.totpCode,
                })
                if (!isValid) throw InvalidOTPException
            } else if (body.code) {
                await this.validateVerificationCode({
                    email: user.email,
                    code: body.code,
                    type: TypeOfVerificationCode.LOGIN,
                })
            }
        }

        const device = await this.authRepository.createDevice({
            userId: user.id,
            userAgent: body.userAgent,
            ip: body.ip,
            isActive: true,
            lastActive: new Date(),
        })

        const tokens = await this.generateTokens({
            userId: user.id,
            deviceId: device.id,
            roles: user.roles,
            providerId: user.serviceProvider?.id ? user.serviceProvider.id : undefined,
            staffProviderId: user.staff?.providerId ? user.staff.providerId : undefined
        })

        return {
            message: 'Login successfully',
            data: tokens,
        }
    }

    async generateTokens(payload: AccessTokenPayloadCreate) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken({
                userId: payload.userId,
                deviceId: payload.deviceId,
                roles: payload.roles,
                providerId: payload.providerId
            }),
            this.tokenService.signRefreshToken(payload),
        ])

        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

        await this.authRepository.createRefreshToken({
            deviceId: payload.deviceId,
            token: refreshToken,
            userId: payload.userId,
            expiresAt: new Date(decodedRefreshToken.exp * 1000),
        })

        return { accessToken, refreshToken }
    }

    async refreshToken({
        refreshToken,
        ip,
        userAgent,
    }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
        try {
            const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

            const refreshTokenInDb =
                await this.authRepository.findUniqueRefreshTokenIncludeUserRole({ token: refreshToken })
            if (!refreshTokenInDb) throw RefreshTokenRevokedException

            const { deviceId, user: { roles } } = refreshTokenInDb

            const $updateDevice = this.authRepository.updateDevice(deviceId, { ip, userAgent })
            const $deleteRefreshToken = this.authRepository.deleteRefreshToken({ token: refreshToken })
            const $tokens = this.generateTokens({ userId, roles, deviceId })

            const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])

            return {
                message: 'Refresh token successfully',
                data: tokens,
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new UnauthorizedException()
        }
    }
    async logout(refreshToken: string) {
        try {
            await this.tokenService.verifyRefreshToken(refreshToken)
            const deleteRefreshToken = await this.authRepository.deleteRefreshToken({
                token: refreshToken
            })
            await this.authRepository.updateDevice(deleteRefreshToken.deviceId, {
                isActive: false
            })
            return { message: 'Logout successfully' }
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException("Refresh token has been revoked")
            }
            throw new UnauthorizedException()
        }
    }
    async forgotPassword(body: ForgotPasswordBodyType) {
        const { email, code, newPassword } = body
        const user = await this.sharedUser.findUnique({
            email
        })
        if (!user) {
            throw EmailNotFoundException
        }

        const verificationCode = await this.validateVerificationCode({
            email: body.email,
            code: code,
            type: TypeOfVerificationCode.FORGOT_PASSWORD
        })
        if (verificationCode.expiresAt < new Date()) {
            throw InvalidOTPException
        }
        const hashedPassword = await this.hashingService.hash(newPassword)
        await Promise.all([
            this.authRepository.deleteVerificationCode({
                email_code_type: {
                    email: body.email,
                    type: TypeOfVerificationCode.FORGOT_PASSWORD,
                    code: body.code
                }
            }), this.sharedUser.update({ id: user.id }, {
                password: hashedPassword
            })
        ])


        return {
            message: "Change password successfully"
        }
    }
    async registerProvider(body: RegisterProviderBodyType) {
        try {
            const verificationCode = await this.validateVerificationCode({
                email: body.email,
                type: TypeOfVerificationCode.REGISTER,
                code: body.code,
            })

            if (verificationCode.expiresAt < new Date()) {
                throw InvalidOTPException
            }
            if (await this.authRepository.findUniqueProviderIncludeNameAndTaxId({ name: body.name, taxId: body.taxId })) {
                throw ServiceProviderAlreadyExistsException
            }
            const hashedPassword = await this.hashingService.hash(body.password)
            const serviceProviderRole = await this.rolesService.getServiceProviderRoleId()

            const [user] = await Promise.all([
                this.authRepository.createUser({
                    email: body.email,
                    password: hashedPassword,
                    roles: [serviceProviderRole],
                    name: body.name,
                    phone: body.phone,
                }),
                this.authRepository.deleteVerificationCode({
                    email_code_type: {
                        email: body.email,
                        type: TypeOfVerificationCode.REGISTER,
                        code: body.code,
                    },
                }),
            ])
            await this.authRepository.createServiceProvider({
                address: body.address,
                taxId: body.taxId,
                companyType: body.companyType,
                description: body.description,
                userId: user.id,
                verificationStatus: VerificationStatusConst.PENDING,
            })
            return {
                message: 'Thank you for registering your business with us. Please check your email — we will notify you once your application has been reviewed and verified.',
            }
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw EmailAlreadyExistsException
            }
            throw error
        }
    }
}
