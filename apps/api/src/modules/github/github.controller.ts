import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { GithubService } from './github.service.js';

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
}
