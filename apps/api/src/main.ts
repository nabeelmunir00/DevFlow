import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Required for GitHub webhook signature verification
    rawBody: true,
  });

  // Apply shared application configuration:
  // - Global API prefix
  // - Helmet security headers
  // - CORS
  // - ValidationPipe
  // - HttpExceptionFilter
  // - ResponseInterceptor
  configureApp(app);

  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);

  console.log(`🚀 DevFlow API running on http://localhost:${port}/api/v1`);
}

void bootstrap();
