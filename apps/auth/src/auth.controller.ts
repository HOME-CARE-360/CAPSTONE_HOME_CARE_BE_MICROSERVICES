
import { Body, Controller, HttpCode, HttpStatus, Get, Ip, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ZodSerializerDto } from 'nestjs-zod';
import { GetAuthorizationUrlResDTO, LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO, ForgotPasswordBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterProviderBodyDto, } from './auth.dto';

import { GoogleService } from './google.service';



import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { UserAgent } from 'libs/common/src/decorator/user-agent.decorator';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { Response } from "express"
import { ConfigService } from '@nestjs/config';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly googleService: GoogleService, private configService: ConfigService) { }
  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body)

  }
  @Post('otp')
  @IsPublic()
  async sendOTP(@Body() body: SendOTPBodyDTO) {
    return await this.authService.sendOTP(body)
  }
  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO)
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {

    return this.authService.login({
      ...body, userAgent, ip
    })


  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)

  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {

    return this.authService.refreshToken({
      refreshToken: body.refreshToken, userAgent, ip
    })


  }
  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken)
  }
  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body)
  }


  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getAuthorizationUrl({
      userAgent,
      ip,
    })
  }
  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({
        code,
        state,
      })
      return res.redirect(
        `${this.configService.get("GOOGLE_CLIENT_REDIRECT_URI")}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(`${this.configService.get("GOOGLE_CLIENT_REDIRECT_URI")}?errorMessage=${message}`)
    }
  }
  @Post('register-provider')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  async registerProvider(@Body() body: RegisterProviderBodyDto) {
    return await this.authService.registerProvider(body)

  }

}

