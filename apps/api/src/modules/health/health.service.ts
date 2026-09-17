import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service.js';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class HealthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Simple liveness check.
   *
   * This does not check external dependencies.
   * If this method responds, the NestJS API process is alive.
   */
  getLiveness() {
    return {
      status: 'ok',
      service: 'devflow-api',
    };
  }

  /**
   * Readiness check.
   *
   * The API is considered ready only when its critical
   * infrastructure dependencies are available.
   */
  async getReadiness() {
    const checks = {
      database: 'disconnected',
      redis: 'disconnected',
    };

    try {
      await this.databaseService.healthCheck();

      checks.database = 'connected';
    } catch {
      throw new ServiceUnavailableException({
        message: 'DevFlow API is not ready',
        checks,
      });
    }

    try {
      const redisResponse = await this.redisService.ping();

      if (redisResponse !== 'PONG') {
        throw new Error('Unexpected Redis ping response');
      }

      checks.redis = 'connected';
    } catch {
      throw new ServiceUnavailableException({
        message: 'DevFlow API is not ready',
        checks,
      });
    }

    return {
      status: 'ready',
      checks,
    };
  }
}
