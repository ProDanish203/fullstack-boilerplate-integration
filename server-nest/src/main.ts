import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 8000;

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Explicitly allow these headers
    exposedHeaders: '*',
    maxAge: 3600,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
