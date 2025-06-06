
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    },
  })
  await app.startAllMicroservices();
  await app.listen(Number(configService.getOrThrow('AUTH_HTTP_PORT')), '0.0.0.0');
  console.log(`🚀 Auth HTTP listening on ${configService.get('AUTH_HTTP_PORT')}`);
}
bootstrap();
