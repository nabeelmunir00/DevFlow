import { Module } from '@nestjs/common';

import { GithubController } from './github.controller.js';
import { GithubIntegrationController } from './github-integration.controller.js';
import { GithubWebhookController } from './github-webhook.controller.js';

import { GithubService } from './github.service.js';
import { GithubWebhookService } from './github-webhook.service.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [ActivityLogsModule, RealtimeModule],
  controllers: [
    GithubController,
    GithubIntegrationController,
    GithubWebhookController,
  ],

  providers: [GithubService, GithubWebhookService],

  exports: [GithubService, GithubWebhookService],
})
export class GithubModule {}
