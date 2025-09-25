import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });

  app.use(json({ limit: '10mb' }));
  app.use(helmet());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Makambo API')
    .setDescription('API documentation for the Makambo survival–conquest backend')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Makambo API running on http://localhost:${port}/api`);
  Logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
