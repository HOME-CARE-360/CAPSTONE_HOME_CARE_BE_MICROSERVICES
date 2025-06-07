import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth.gateway.controller';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';

import { APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'libs/common/src/pipes/custom-zod-validation.pipe';
import { AUTH_SERVICE, MANAGER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [CommonModule, ConfigModule, AuthModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.TCP_PORT || '3002'),
        },
      }, {
        name: MANAGER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.MANAGER_HOST || 'localhost',
          port: parseInt(process.env.MANAGER_TCP_PORT || '3004'),
        },
      }
    ]),
  ],
  controllers: [AuthGatewayController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe

    }
  ]
})
export class AppModule { }
