import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { Job, Worker } from 'bullmq';

import { RedisService } from '../../../redis/redis.service.js';

import { GithubWebhookService } from '../github-webhook.service.js';
import { GithubWebhookDeliveryService } from '../github-webhook-delivery.service.js';

import {
  GITHUB_WEBHOOK_JOB,
  GITHUB_WEBHOOK_QUEUE,
} from './github-webhook-queue.constants.js';

import type { GithubWebhookJobData } from './github-webhook-queue.service.js';

@Injectable()
export class GithubWebhookProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GithubWebhookProcessor.name);

  private worker?: Worker<GithubWebhookJobData>;

  constructor(
    private readonly redisService: RedisService,
    private readonly githubWebhookService: GithubWebhookService,
    private readonly githubWebhookDeliveryService: GithubWebhookDeliveryService,
  ) {}

  onModuleInit() {
    this.worker = new Worker<GithubWebhookJobData>(
      GITHUB_WEBHOOK_QUEUE,

      async (job: Job<GithubWebhookJobData>) => {
        if (job.name !== GITHUB_WEBHOOK_JOB) {
          throw new Error(`Unknown GitHub webhook job: ${job.name}`);
        }

        const { event, deliveryId, body } = job.data;
        if (event === 'devflow_retry_test') {
          throw new Error('Intentional GitHub webhook retry test failure');
        }

        this.logger.log(
          `Processing GitHub webhook: event=${event} delivery=${deliveryId} attempt=${job.attemptsMade + 1}`,
        );

        const result = await this.githubWebhookService.handleEvent(
          event,
          deliveryId,
          body,
        );

        await this.githubWebhookDeliveryService.markCompleted(deliveryId);

        return result;
      },

      {
        connection: this.redisService.getClient(),
        concurrency: 5,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(
        `GitHub webhook completed: delivery=${job.data.deliveryId}`,
      );
    });

    this.worker.on('failed', async (job, error) => {
      if (!job) {
        this.logger.error(`GitHub webhook job failed: ${error.message}`);

        return;
      }

      const maxAttempts =
        typeof job.opts.attempts === 'number' ? job.opts.attempts : 1;

      const attemptsUsed = job.attemptsMade;

      this.logger.error(
        `GitHub webhook failed: delivery=${job.data.deliveryId} attempt=${attemptsUsed}/${maxAttempts}: ${error.message}`,
      );

      if (attemptsUsed >= maxAttempts) {
        await this.githubWebhookDeliveryService.markFailed(job.data.deliveryId);

        this.logger.error(
          `GitHub webhook permanently failed: delivery=${job.data.deliveryId}`,
        );
      }
    });

    this.logger.log('GitHub webhook worker started');
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }
}
