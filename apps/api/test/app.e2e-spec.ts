import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/configure-app.js';

describe('App API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configureApp(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health should return standardized response', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      statusCode: 200,
      data: {
        status: 'ok',
        service: 'devflow-api',
      },
    });

    expect(response.body.timestamp).toBeDefined();
  });

  it('should include Helmet security headers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');

    expect(response.headers['x-frame-options']).toBeDefined();
  });

  it('GET /api/v1/users/me without token should return standardized 401', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      statusCode: 401,
      path: '/api/v1/users/me',
    });

    expect(response.body.message).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });
});
