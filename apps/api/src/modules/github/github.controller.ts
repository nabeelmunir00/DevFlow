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

import { LinkRepositoryDto } from './dto/link-repository.dto.js';

import { GithubService } from './github.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('app')
  async getAppInfo() {
    const app = await this.githubService.getAppInfo();

    return {
      message: 'GitHub App authenticated successfully',
      app,
    };
  }

  @Get('installations')
  async listInstallations() {
    const installations = await this.githubService.listInstallations();

    return {
      installations,
    };
  }

  @Get('installations/:installationId/token-test')
  async testInstallationToken(
    @Param('installationId', ParseIntPipe)
    installationId: number,
  ) {
    const auth = await this.githubService.getInstallationToken(installationId);

    return {
      message: 'Installation authentication successful',

      installationId,

      tokenType: auth.tokenType,

      expiresAt: auth.expiresAt,
    };
  }
  @Get('installations/:installationId/repositories')
  async listInstallationRepositories(
    @Param('installationId', ParseIntPipe)
    installationId: number,
  ) {
    const repositories =
      await this.githubService.listInstallationRepositories(installationId);

    return {
      count: repositories.length,
      repositories,
    };
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
