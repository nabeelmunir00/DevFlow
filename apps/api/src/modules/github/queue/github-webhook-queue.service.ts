import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

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
export class GithubWebhookQueueService {
  constructor(
    @InjectQueue(GITHUB_WEBHOOK_QUEUE)
    private readonly queue: Queue<GithubWebhookJobData>,
  ) {}

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
}
