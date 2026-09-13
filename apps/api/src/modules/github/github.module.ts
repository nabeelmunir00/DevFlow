import { Module } from '@nestjs/common';

import { GithubController } from './github.controller.js';
import { GithubIntegrationController } from './github-integration.controller.js';
import { GithubService } from './github.service.js';

@Module({
  controllers: [GithubController, GithubIntegrationController],

  providers: [GithubService],

  exports: [GithubService],
})
export class GithubModule {}
