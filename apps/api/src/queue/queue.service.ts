import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly testQueue: Queue;

  constructor(private readonly redisService: RedisService) {
    this.testQueue = new Queue('devflow-test', {
      connection: this.redisService.getClient(),
    });
  }

  async addTestJob(data: Record<string, unknown>) {
    return this.testQueue.add('test-job', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }

  async onModuleDestroy() {
    await this.testQueue.close();
  }
}
