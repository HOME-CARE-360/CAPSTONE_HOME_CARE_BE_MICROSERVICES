import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from "@nestjs/microservices"
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from 'libs/common/src/types/auth';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService)
  app.enableCors({});

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/auth.proto'),
      url: configService.getOrThrow('AUTH_GRPC_URL'),
    },
  });
  await app.startAllMicroservices()
  await app.listen(configService.get("AUTH_PORT") as string, "0.0.0.0");
  console.log(`🚀 App listening on port ${process.env.AUTH_PORT as string}`);
}
bootstrap();


