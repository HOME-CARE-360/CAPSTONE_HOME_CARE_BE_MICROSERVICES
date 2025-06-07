import { NestFactory } from '@nestjs/core';
import { ProviderModule } from './provider.module';

async function bootstrap() {
  const app = await NestFactory.create(ProviderModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
