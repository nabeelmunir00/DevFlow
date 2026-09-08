import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { createDatabase, type Database } from '@devflow/db';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly db: Database;

  private readonly pool;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const connection = createDatabase(databaseUrl);

    this.db = connection.db;
    this.pool = connection.pool;
  }

  async healthCheck() {
    await this.pool.query('SELECT 1');
    return true;
  }

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
