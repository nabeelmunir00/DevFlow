import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { DatabaseService } from '../src/database/database.service.js';
import { HealthController } from '../src/modules/health/health.controller.js';
import { HealthService } from '../src/modules/health/health.service.js';
import { RedisService } from '../src/redis/redis.service.js';

describe('Health API (e2e)', () => {
  let app: INestApplication;

  const databaseService = {
    healthCheck: vi.fn(),
  };

  const redisService = {
    ping: vi.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health should return liveness status', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'devflow-api',
    });
  });

  it('GET /api/v1/health/ready should return readiness status', async () => {
    databaseService.healthCheck.mockResolvedValue(undefined);
    redisService.ping.mockResolvedValue('PONG');

    const response = await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ready',
      checks: {
        database: 'connected',
        redis: 'connected',
      },
    });

    expect(databaseService.healthCheck).toHaveBeenCalled();
    expect(redisService.ping).toHaveBeenCalled();
  });
});
