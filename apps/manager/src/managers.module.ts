import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagerRepository } from './managers.repo';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { AccessTokenGuard } from 'libs/common/src/guards/access-token.guard';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthenticationGuard } from 'libs/common/src/guards/authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import CustomZodValidationPipe from 'libs/common/src/pipes/custom-zod-validation.pipe';

@Module({
  imports: [CommonModule, ConfigModule, JwtModule],
  controllers: [ManagersController],
  providers: [ManagersService, ManagerRepository, AccessTokenGuard, {
    provide: APP_GUARD,
    useClass: AuthenticationGuard,
  }, {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe

    }],
})
export class ManagersModule { }
