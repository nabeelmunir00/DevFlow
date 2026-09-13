import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { GithubService } from './github.service.js';
import { LinkRepositoryDto } from './dto/link-repository.dto.js';

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

  @Get('repositories')
  async getRepositories(
    @Param('organizationId')
    organizationId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubService.getOrganizationRepositories(
      organizationId,
      clerkUserId.userId,
    );
  }

  @Patch('repositories/:repositoryId/link')
  async linkRepository(
    @Param('organizationId')
    organizationId: string,

    @Param('repositoryId')
    repositoryId: string,

    @Body()
    dto: LinkRepositoryDto,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubService.linkRepositoryToProject(
      organizationId,
      repositoryId,
      dto.projectId,
      clerkUserId.userId,
    );
  }

  @Delete('repositories/:repositoryId/link')
  async unlinkRepository(
    @Param('organizationId')
    organizationId: string,

    @Param('repositoryId')
    repositoryId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubService.unlinkRepositoryFromProject(
      organizationId,
      repositoryId,
      clerkUserId.userId,
    );
  }
}
