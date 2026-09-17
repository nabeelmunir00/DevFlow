import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Liveness
   *
   * Checks whether the API process is running.
   */
  @Get()
  checkLiveness() {
    return this.healthService.getLiveness();
  }

  /**
   * Readiness
   *
   * Checks critical infrastructure:
   * - PostgreSQL
   * - Redis
   */
  @Get('ready')
  async checkReadiness() {
    return this.healthService.getReadiness();
  }
}
