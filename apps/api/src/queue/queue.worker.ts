import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { Job, Worker } from 'bullmq';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class QueueWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueWorker.name);

  private worker?: Worker;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.worker = new Worker(
      'devflow-test',

      async (job: Job) => {
        this.logger.log(`Processing job ${job.id} - ${job.name}`);

        this.logger.log(`Job data: ${JSON.stringify(job.data)}`);

        return {
          success: true,
          processedAt: new Date().toISOString(),
        };
      },

      {
        connection: this.redisService.getClient(),
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Job ${job?.id} failed: ${error.message}`);
    });

    this.logger.log('BullMQ worker started');
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }
}
