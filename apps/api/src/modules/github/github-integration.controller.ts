import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { GithubService } from './github.service.js';

@Controller('organizations/:organizationId/github')
@UseGuards(ClerkAuthGuard)
export class GithubIntegrationController {
  constructor(private readonly githubService: GithubService) {}

  @Post('installations/:installationId/sync')
  async syncInstallation(
    @Param('organizationId')
    organizationId: string,

    @Param('installationId', ParseIntPipe)
    installationId: number,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubService.syncInstallation(
      organizationId,
      clerkUserId.userId,
      installationId,
    );
  }
}
