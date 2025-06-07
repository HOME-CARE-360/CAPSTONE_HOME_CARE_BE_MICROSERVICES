import {
    Body,
    Controller,
    Get,
    Ip,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { handleZodError } from 'libs/common/helpers';
import { AUTH_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { UserAgent } from 'libs/common/src/decorator/user-agent.decorator';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ForgotPasswordBodyDTO, GetAuthorizationUrlResDTO, LoginBodyDTO, LoginResDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterProviderBodyDto, RegisterResDTO, SendOTPBodyDTO } from 'libs/common/src/request-response-type/auth/auth.dto';

import { ZodSerializerDto } from 'nestjs-zod';
import { lastValueFrom } from 'rxjs';
@Controller('auth')
export class AuthGatewayController {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy
    ) { }
    @ApiBody({ type: RegisterBodyDTO })
    @IsPublic()
    @Post('register')
    @ZodSerializerDto(RegisterResDTO)
    async register(@Body() body: RegisterBodyDTO) {
        try {
            return await lastValueFrom(this.authClient.send({ cmd: 'register' }, body));
        } catch (error) {
            console.log(error);

            handleZodError(error)


        }

    }
    @ApiBody({ type: SendOTPBodyDTO })
    @IsPublic()
    @Post('otp')
    async sendOTP(@Body() body: SendOTPBodyDTO) {
        try {
            return await lastValueFrom(this.authClient.send({ cmd: 'otp' }, body));
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @ApiBody({ type: LoginBodyDTO })
    @IsPublic()
    @Post('login')
    @ZodSerializerDto(LoginResDTO)
    async login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
        try {
            const result = await lastValueFrom(
                this.authClient.send({ cmd: 'login' }, { ...body, ip, userAgent })
            );
            return result;
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }




    }
    @ApiBody({ type: RefreshTokenBodyDTO })
    @IsPublic()
    @Post('refresh-token')
    @ZodSerializerDto(RefreshTokenResDTO)
    async refreshToken(@Body() body: RefreshTokenBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
        try {
            return await lastValueFrom(
                this.authClient.send(
                    { cmd: 'refresh-token' },
                    { refreshToken: body.refreshToken, ip, userAgent }
                )
            );
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @ApiBody({ type: LogoutBodyDTO })
    @IsPublic()
    @Post('logout')
    @ZodSerializerDto(MessageResDTO)
    async logout(@Body() body: LogoutBodyDTO) {
        try {
            return await lastValueFrom(
                this.authClient.send({ cmd: 'logout' }, body.refreshToken)
            );
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @ApiBody({ type: ForgotPasswordBodyDTO })
    @IsPublic()
    @Post('forgot-password')
    @ZodSerializerDto(MessageResDTO)
    async forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
        try {
            return await lastValueFrom(
                this.authClient.send({ cmd: 'forgot-password' }, body)
            );
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @IsPublic()
    @Get('google-link')
    @ZodSerializerDto(GetAuthorizationUrlResDTO)
    async getAuthorizationUrl(@Ip() ip: string, @UserAgent() userAgent: string) {
        try {
            return await lastValueFrom(
                this.authClient.send({ cmd: 'google-link' }, { ip, userAgent })
            );
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @IsPublic()
    @Get('google/callback')
    async googleCallback(
        @Query('code') code: string, @Query('state') state: string, @Res() res: Response
    ) {
        try {
            const result: any = await lastValueFrom(
                this.authClient.send({ cmd: 'google-callback' }, { code, state })
            );
            return res.redirect(
                `${process.env.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại.';
            return res.redirect(
                `${process.env.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`
            );
        }
    }
    @ApiBody({ type: RegisterProviderBodyDto })
    @IsPublic()
    @Post('register-provider')
    @ZodSerializerDto(MessageResDTO)
    async registerProvider(@Body() body: RegisterProviderBodyDto) {
        try {
            return await lastValueFrom(
                this.authClient.send({ cmd: 'register-provider' }, body)
            );
        } catch (error) {
            console.log(error);

            handleZodError(error)
        }

    }
    @IsPublic()
    @Get("ping")
    pong() {
        return {
            data: "pong"
        }
    }
    @IsPublic()
    @Get('api')
    async swagger() {
        return await lastValueFrom(
            this.authClient.send({ cmd: 'api' }, {})
        );
    }
}
