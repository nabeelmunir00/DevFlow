import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async check() {
    await this.databaseService.healthCheck();

    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
