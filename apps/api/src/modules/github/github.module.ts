import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { GithubController } from './github.controller.js';
import { GithubIntegrationController } from './github-integration.controller.js';
import { GithubWebhookController } from './github-webhook.controller.js';

import { GithubService } from './github.service.js';
import { GithubWebhookService } from './github-webhook.service.js';
import { GithubWebhookDeliveryService } from './github-webhook-delivery.service.js';

import { GithubWebhookQueueService } from './queue/github-webhook-queue.service.js';
import { GITHUB_WEBHOOK_QUEUE } from './queue/github-webhook-queue.constants.js';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [
    ActivityLogsModule,
    RealtimeModule,

    BullModule.registerQueue({
      name: GITHUB_WEBHOOK_QUEUE,
    }),
  ],

  controllers: [
    GithubController,
    GithubIntegrationController,
    GithubWebhookController,
  ],

  providers: [
    GithubService,
    GithubWebhookService,
    GithubWebhookDeliveryService,
    GithubWebhookQueueService,
  ],

  exports: [GithubService, GithubWebhookService],
})
export class GithubModule {}
