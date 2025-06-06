import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthReponsitory } from './auth.repo';
import { GoogleService } from './google.service';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'libs/common/src/pipes/custom-zod-validation.pipe';

@Module({
  imports: [CommonModule, ConfigModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, AuthReponsitory, GoogleService, {
    provide: APP_PIPE,
    useClass: CustomZodValidationPipe
  }],
})
export class AuthModule { }
