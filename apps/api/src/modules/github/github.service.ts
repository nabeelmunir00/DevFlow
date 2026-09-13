import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { App } from '@octokit/app';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { InstallationAccessTokenAuthentication } from '@octokit/auth-app';

@Injectable()
export class GithubService implements OnModuleInit {
  private githubApp!: App;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const appId = this.configService.get<string>('GITHUB_APP_ID');

    const privateKeyPath = this.configService.get<string>(
      'GITHUB_PRIVATE_KEY_PATH',
    );

    const webhookSecret = this.configService.get<string>(
      'GITHUB_WEBHOOK_SECRET',
    );

    if (!appId) {
      throw new Error('GITHUB_APP_ID is not configured');
    }

    if (!privateKeyPath) {
      throw new Error('GITHUB_PRIVATE_KEY_PATH is not configured');
    }

    if (!webhookSecret) {
      throw new Error('GITHUB_WEBHOOK_SECRET is not configured');
    }

    const absolutePath = resolve(process.cwd(), privateKeyPath);

    const privateKey = await readFile(absolutePath, 'utf8');

    this.githubApp = new App({
      appId,
      privateKey,

      webhooks: {
        secret: webhookSecret,
      },
    });

    console.log('GitHub App client initialized');
  }

  async getAppInfo() {
    try {
      const response = await this.githubApp.octokit.request('GET /app');

      return response.data;
    } catch (error) {
      console.error('GitHub App authentication failed:', error);

      throw new InternalServerErrorException(
        'Failed to authenticate GitHub App',
      );
    }
  }

  async getInstallationToken(
    installationId: number,
  ): Promise<InstallationAccessTokenAuthentication> {
    try {
      const installationOctokit =
        await this.githubApp.getInstallationOctokit(installationId);

      const auth = await installationOctokit.auth({
        type: 'installation',
      });

      return auth as InstallationAccessTokenAuthentication;
    } catch (error) {
      console.error('Failed to generate installation token:', error);

      throw new InternalServerErrorException(
        'Failed to generate GitHub installation token',
      );
    }
  }

  async listInstallations() {
    try {
      const response = await this.githubApp.octokit.request(
        'GET /app/installations',
        {
          per_page: 100,
        },
      );

      return response.data;
    } catch (error) {
      console.error('Failed to list GitHub installations:', error);

      throw new InternalServerErrorException(
        'Failed to fetch GitHub installations',
      );
    }
  }

  async listInstallationRepositories(installationId: number) {
    try {
      const installationOctokit =
        await this.githubApp.getInstallationOctokit(installationId);

      const response = await installationOctokit.request(
        'GET /installation/repositories',
        {
          per_page: 100,
        },
      );

      return response.data.repositories;
    } catch (error) {
      console.error('Failed to fetch installation repositories:', error);

      throw new InternalServerErrorException(
        'Failed to fetch GitHub repositories',
      );
    }
  }
}
