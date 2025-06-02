import { NestFactory } from '@nestjs/core'; import { ConfigService } from '@nestjs/config';
import { setApp } from './app';
import { AppModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('GATEWAY_HTTP_PORT'));
  setApp(app);
}
bootstrap();