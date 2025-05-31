import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthReponsitory } from './auth.repo';
import { GoogleService } from './google.service';
import { CommonModule } from 'libs/common/src';

@Module({
  imports: [CommonModule],
  controllers: [AuthController,],
  providers: [AuthService, AuthReponsitory, GoogleService],
})
export class AuthModule { }
