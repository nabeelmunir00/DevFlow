import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');

  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());
}
