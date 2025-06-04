import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

export const InvalidOTPException = new UnprocessableEntityException([
    {
        message: 'Error.InvalidOTP',
        path: 'code',
    },
])


export const OTPExpiredException = new UnprocessableEntityException([
    {
        message: 'Error.OTPExpired',
        path: 'code',
    },
])

export const FailedToSendOTPException = new UnprocessableEntityException([
    {
        message: 'Error.FailedToSendOTP',
        path: 'code',
    },
])
export const RefreshTokenRevokedException = new UnauthorizedException({
    message: 'Error.RefreshTokenRevoked',
    path: 'refreshToken',
})
export const EmailAlreadyExistsException = new UnprocessableEntityException([
    {
        message: 'Error.EmailAlreadyExists',
        path: 'email',
    },
])
export const ServiceProviderAlreadyExistsException = new UnprocessableEntityException([
    {
        message: 'Error.ServiceProviderAlreadyExists',
        path: ["taxId", "name"],
    },
])
export const InvalidPasswordException = new UnprocessableEntityException([
    {
        message: 'Error.InvalidPassword',
        path: 'password',
    },
])

export const EmailNotFoundException = new UnprocessableEntityException([
    {
        message: 'Error.EmailNotFound',
        path: 'email',
    },
])


export const RefreshTokenAlreadyUsedException = new UnauthorizedException('Error.RefreshTokenAlreadyUsed')
export const UnauthorizedAccessException = new UnauthorizedException('Error.UnauthorizedAccess')


export const GoogleUserInfoError = new Error('Error.FailedToGetGoogleUserInfo')

export const InvalidTOTPException = new UnprocessableEntityException([
    {
        message: 'Error.InvalidTOTP',
        path: 'totpCode',
    },
])

export const TOTPAlreadyEnabledException = new UnprocessableEntityException([
    {
        message: 'Error.TOTPAlreadyEnabled',
        path: 'totpCode',
    },
])

export const TOTPNotEnabledException = new UnprocessableEntityException([
    {
        message: 'Error.TOTPNotEnabled',
        path: 'totpCode',
    },
])

export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
    {
        message: 'Error.InvalidTOTPAndCode',
        path: 'totpCode',
    },
    {
        message: 'Error.InvalidTOTPAndCode',
        path: 'code',
    },
])
