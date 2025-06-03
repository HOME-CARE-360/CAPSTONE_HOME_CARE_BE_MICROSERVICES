import { NestFactory } from '@nestjs/core'; import { ConfigService } from '@nestjs/config';
import { setApp } from './app';
import { AppModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('GATEWAY_HTTP_PORT') || 3000);
  console.log(`🚀 App listening on port ${process.env.GATEWAY_HTTP_PORT as string}`);
  setApp(app);
}
bootstrap();