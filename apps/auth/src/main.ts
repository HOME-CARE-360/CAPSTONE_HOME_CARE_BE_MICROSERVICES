import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from "@nestjs/microservices"
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get("TCP_PORT")
    }
  })
  await app.startAllMicroservices()
  await app.listen(configService.get("AUTH_PORT") as string);
  console.log(`🚀 App listening on port ${process.env.AUTH_PORT as string}`);
}
bootstrap();


