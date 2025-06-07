
import { Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ZodSerializerDto } from 'nestjs-zod';
import { GetAuthorizationUrlResDTO, LoginBodyDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO, ForgotPasswordBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterProviderBodyDto, } from 'libs/common/src/request-response-type/auth/auth.dto';

import { GoogleService } from './google.service';



import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';


@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly googleService: GoogleService, private configService: ConfigService) { }
  @MessagePattern({ cmd: 'register' })
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body)

  }
  @MessagePattern({ cmd: 'otp' })
  @IsPublic()
  async sendOTP(@Body() body: SendOTPBodyDTO) {
    return await this.authService.sendOTP(body)
  }
  @MessagePattern({ cmd: 'login' })
  @IsPublic()
  login(body: LoginBodyDTO & { ip: string, userAgent: string }) {
    return this.authService.login({
      ...body
    })


  }

  @MessagePattern({ cmd: 'refresh-token' })
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(@Body() body: RefreshTokenBodyDTO & {
    ip: string, userAgent: string
  }) {

    return this.authService.refreshToken({
      refreshToken: body.refreshToken, ip: body.ip, userAgent: body.userAgent
    })


  }
  @MessagePattern({ cmd: 'logout' })
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken)
  }
  @MessagePattern({ cmd: 'forgot-password' })
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body)
  }

  @MessagePattern({ cmd: 'google-link' })
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(ip: string, userAgent: string) {
    return this.googleService.getAuthorizationUrl({
      userAgent,
      ip,
    })
  }
  @MessagePattern({ cmd: 'google/callback' })
  @IsPublic()
  async googleCallback(code: string, state: string) {
    const data = await this.googleService.googleCallback({
      code,
      state,
    })
    return data
  }
  @MessagePattern({ cmd: 'register-provider' })
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  async registerProvider(@Body() body: RegisterProviderBodyDto) {
    return await this.authService.registerProvider(body)
  }

}

