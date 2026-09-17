import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Global request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global successful response formatting
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);

  console.log(`🚀 DevFlow API running on http://localhost:${port}/api/v1`);
}

void bootstrap();
