import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

import { GithubWebhookService } from '../github-webhook.service.js';
import { GithubWebhookDeliveryService } from '../github-webhook-delivery.service.js';

import {
  GITHUB_WEBHOOK_JOB,
  GITHUB_WEBHOOK_QUEUE,
} from './github-webhook-queue.constants.js';

import type { GithubWebhookJobData } from './github-webhook-queue.service.js';

@Injectable()
@Processor(GITHUB_WEBHOOK_QUEUE)
export class GithubWebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(GithubWebhookProcessor.name);

  constructor(
    private readonly githubWebhookService: GithubWebhookService,
    private readonly githubWebhookDeliveryService: GithubWebhookDeliveryService,
  ) {
    super();
  }

  async process(job: Job<GithubWebhookJobData>) {
    if (job.name !== GITHUB_WEBHOOK_JOB) {
      this.logger.warn(`Unknown GitHub webhook job ignored: ${job.name}`);

      return;
    }

    const { event, deliveryId, body } = job.data;

    this.logger.log(
      `Processing GitHub webhook: event=${event} delivery=${deliveryId} attempt=${job.attemptsMade + 1}`,
    );

    try {
      const result = await this.githubWebhookService.handleEvent(
        event,
        deliveryId,
        body,
      );

      await this.githubWebhookDeliveryService.markCompleted(deliveryId);

      this.logger.log(`GitHub webhook completed: delivery=${deliveryId}`);

      return result;
    } catch (error) {
      /*
       * BullMQ will retry the job according to:
       * attempts: 3
       * exponential backoff: 3000ms
       *
       * Do NOT mark FAILED here yet because another BullMQ
       * attempt may still process this same job.
       */
      this.logger.error(
        `GitHub webhook processing failed: delivery=${deliveryId} attempt=${job.attemptsMade + 1}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
