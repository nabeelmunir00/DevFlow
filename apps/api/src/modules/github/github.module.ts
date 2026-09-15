import { Module } from '@nestjs/common';

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
import { GithubWebhookProcessor } from './queue/github-webhook.processor.js';
import { GithubEntityPersistenceService } from './persistence/github-entity-persistence.service.js';
import { GithubTaskLinksService } from './task-links/github-task-links.service.js';
import { GithubTaskLinksController } from './task-links/github-task-links.controller.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';
import { GithubTaskAutomationService } from './automation/github-task-automation.service.js';
@Module({
  imports: [ActivityLogsModule, RealtimeModule, RbacModule],

  controllers: [
    GithubController,
    GithubIntegrationController,
    GithubWebhookController,
    GithubTaskLinksController,
  ],

  providers: [
    GithubService,
    GithubWebhookService,
    GithubWebhookDeliveryService,
    GithubWebhookQueueService,
    GithubWebhookProcessor,
    GithubEntityPersistenceService,
    GithubTaskLinksService,
    GithubTaskAutomationService,
  ],

  exports: [GithubService, GithubWebhookService],
})
export class GithubModule {}
