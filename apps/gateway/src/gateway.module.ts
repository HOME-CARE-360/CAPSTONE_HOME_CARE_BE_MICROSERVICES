import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth.gateway.controller';
import { CommonModule } from 'libs/common/src';
import { ConfigModule } from 'libs/common/src/modules/config.module';
import { AUTH_SERVICE_NAME } from 'libs/common/src/types/auth';

@Module({
  imports: [CommonModule, ConfigModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.TCP_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController],
})
export class AppModule { }
