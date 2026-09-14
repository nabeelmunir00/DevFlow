import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { GithubService } from './github.service.js';

type GithubInstallationRepositoriesPayload = {
  action: 'added' | 'removed';
  installation: {
    id: number;
  };
  repositories_added?: Array<{
    id: number;
    name: string;
    full_name: string;
  }>;
  repositories_removed?: Array<{
    id: number;
    name: string;
    full_name: string;
  }>;
};

type GithubPushPayload = {
  ref: string;
  before: string;
  after: string;

  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
  };

  installation?: {
    id: number;
  };

  pusher?: {
    name?: string;
    email?: string;
  };

  sender?: {
    login?: string;
    id?: number;
  };

  commits?: Array<{
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author?: {
      name?: string;
      email?: string;
    };
  }>;
};

@Injectable()
export class GithubWebhookService {
  private readonly logger = new Logger(GithubWebhookService.name);

  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly githubService: GithubService,
  ) {
    const webhookSecret = this.configService.get<string>(
      'GITHUB_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('GITHUB_WEBHOOK_SECRET is not configured');
    }

    this.webhookSecret = webhookSecret;
  }

  verifySignature(rawBody: Buffer, signature: string | undefined): void {
    if (!signature) {
      throw new UnauthorizedException('Missing GitHub webhook signature');
    }

    if (!signature.startsWith('sha256=')) {
      throw new UnauthorizedException(
        'Invalid GitHub webhook signature format',
      );
    }

    const expectedSignature = `sha256=${createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex')}`;

    const expectedBuffer = Buffer.from(expectedSignature);

    const receivedBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== receivedBuffer.length) {
      throw new UnauthorizedException('Invalid GitHub webhook signature');
    }

    const valid = timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!valid) {
      throw new UnauthorizedException('Invalid GitHub webhook signature');
    }
  }

  async handleEvent(event: string, deliveryId: string, payload: unknown) {
    this.logger.log(
      `GitHub webhook received event=${event} delivery=${deliveryId}`,
    );

    switch (event) {
      case 'installation_repositories':
        return this.handleInstallationRepositories(
          deliveryId,
          payload as GithubInstallationRepositoriesPayload,
        );

      case 'installation':
        this.logger.log(`Installation event received delivery=${deliveryId}`);

        return {
          received: true,
          event,
          deliveryId,
        };

      case 'push':
        return this.handlePush(deliveryId, payload as GithubPushPayload);
      case 'pull_request':
      case 'issues':
      case 'issue_comment':
        this.logger.log(
          `GitHub event ${event} received but processing is not implemented yet`,
        );

        return {
          received: true,
          event,
          deliveryId,
        };

      default:
        this.logger.warn(`Unhandled GitHub event: ${event}`);

        return {
          received: true,
          ignored: true,
          event,
          deliveryId,
        };
    }
  }

  private async handleInstallationRepositories(
    deliveryId: string,
    payload: GithubInstallationRepositoriesPayload,
  ) {
    const installationId = payload.installation?.id;

    if (!installationId) {
      throw new BadRequestException('GitHub installation ID missing');
    }

    this.logger.log(
      `installation_repositories action=${payload.action} installation=${installationId}`,
    );

    this.logger.log(
      `Repositories added=${payload.repositories_added?.length ?? 0}, removed=${payload.repositories_removed?.length ?? 0}`,
    );

    const result =
      await this.githubService.syncInstallationFromWebhook(installationId);

    return {
      received: true,
      event: 'installation_repositories',
      deliveryId,
      action: payload.action,
      installationId,
      ...result,
    };
  }
  private async handlePush(deliveryId: string, payload: GithubPushPayload) {
    const repositoryId = payload.repository?.id;

    if (!repositoryId) {
      throw new BadRequestException('GitHub repository ID missing');
    }

    const branch = payload.ref?.replace('refs/heads/', '') ?? null;

    this.logger.log(
      `GitHub push repo=${payload.repository.full_name} branch=${branch} commits=${payload.commits?.length ?? 0}`,
    );

    return {
      received: true,
      event: 'push',
      deliveryId,

      repository: {
        githubRepositoryId: repositoryId,
        name: payload.repository.name,
        fullName: payload.repository.full_name,
      },

      branch,

      before: payload.before,
      after: payload.after,

      sender: payload.sender?.login ?? null,

      commitCount: payload.commits?.length ?? 0,

      commits:
        payload.commits?.map((commit) => ({
          id: commit.id,
          message: commit.message,
          timestamp: commit.timestamp,
          url: commit.url,
          author: commit.author?.name ?? null,
        })) ?? [],
    };
  }
  generateTestSignature(payload: string) {
    const expectedSignature = `sha256=${createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')}`;
    return expectedSignature;
  }
}
