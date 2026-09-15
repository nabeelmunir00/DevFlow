import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { Queue } from 'bullmq';

import { RedisService } from '../../../redis/redis.service.js';

import {
  GITHUB_WEBHOOK_JOB,
  GITHUB_WEBHOOK_QUEUE,
} from './github-webhook-queue.constants.js';

export interface GithubWebhookJobData {
  event: string;
  deliveryId: string;
  body: unknown;
}

@Injectable()
export class GithubWebhookQueueService implements OnModuleDestroy {
  private readonly queue: Queue<GithubWebhookJobData>;

  constructor(private readonly redisService: RedisService) {
    this.queue = new Queue<GithubWebhookJobData>(GITHUB_WEBHOOK_QUEUE, {
      connection: this.redisService.getClient(),
    });
  }

  async enqueue(data: GithubWebhookJobData) {
    return this.queue.add(GITHUB_WEBHOOK_JOB, data, {
      jobId: data.deliveryId,

      attempts: 3,

      backoff: {
        type: 'exponential',
        delay: 3000,
      },

      removeOnComplete: {
        age: 3600,
        count: 1000,
      },

      removeOnFail: {
        age: 86400,
        count: 5000,
      },
    });
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
