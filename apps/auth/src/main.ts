
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);


  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: Number(configService.getOrThrow('AUTH_TCP_PORT')),
      host: '0.0.0.0',
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(configService.getOrThrow('AUTH_HTTP_PORT')), '0.0.0.0');
  console.log(`🚀 Auth HTTP listening on ${configService.get('AUTH_HTTP_PORT')}`);
}
bootstrap();
