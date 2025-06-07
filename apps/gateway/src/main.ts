import { NestFactory } from '@nestjs/core'; import { ConfigService } from '@nestjs/config';
import { setApp } from './app';
import { AppModule } from './gateway.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  patchNestJsSwagger()
  const config = new DocumentBuilder()
    .setTitle('Home Care 360 API')
    .setDescription('The API for the home care 360 application')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        name: 'authorization',
        type: 'apiKey',
      },
      'payment-api-key',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  })
  await app.listen(configService.getOrThrow('GATEWAY_HTTP_PORT') || 3000);
  console.log(`🚀 App listening on port ${process.env.GATEWAY_HTTP_PORT as string}`);
  setApp(app);
}
bootstrap()