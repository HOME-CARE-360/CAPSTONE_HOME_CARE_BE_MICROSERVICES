import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Ip,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
    ) { }

    @Post('register')
    async register(@Body() body: any) {
        return await lastValueFrom(this.authClient.send({ cmd: 'register' }, body));
    }

    @Post('otp')
    async sendOTP(@Body() body: any) {
        return await lastValueFrom(this.authClient.send({ cmd: 'send-otp' }, body));
    }

    @Post('login')
    async login(@Body() body: any, @Ip() ip: string) {
        const userAgent = body.userAgent || '';
        return await lastValueFrom(
            this.authClient.send({ cmd: 'login' }, { ...body, ip, userAgent })
        );
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: any, @Ip() ip: string) {
        const userAgent = body.userAgent || '';
        return await lastValueFrom(
            this.authClient.send(
                { cmd: 'refresh-token' },
                { refreshToken: body.refreshToken, ip, userAgent }
            )
        );
    }

    @Post('logout')
    async logout(@Body() body: any) {
        return await lastValueFrom(
            this.authClient.send({ cmd: 'logout' }, body.refreshToken)
        );
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: any) {
        return await lastValueFrom(
            this.authClient.send({ cmd: 'forgot-password' }, body)
        );
    }

    @Get('google-link')
    async getAuthorizationUrl(@Ip() ip: string, @Query('userAgent') userAgent?: string) {
        return await lastValueFrom(
            this.authClient.send({ cmd: 'google-link' }, { ip, userAgent })
        );
    }

    @Get('google/callback')
    async googleCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Res() res: Response
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

    @Post('register-provider')
    async registerProvider(@Body() body: any) {
        return await lastValueFrom(
            this.authClient.send({ cmd: 'register-provider' }, body)
        );
    }

    @Post('authenticate')
    authenticate(@Body() data: any) {
        return {
            ...data.user,
            id: data.user._id,
        };
    }
}
