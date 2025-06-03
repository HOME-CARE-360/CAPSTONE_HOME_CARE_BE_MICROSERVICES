import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth.gateway.controller';
import { AUTH_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { CommonModule } from 'libs/common/src';

@Module({
  imports: [CommonModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.AUTH_PORT || '3001'),
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController],
})
export class AppModule { }
