import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { createHmac, timingSafeEqual } from 'node:crypto';

import { githubInstallations, githubRepositories } from '@devflow/db';

import { eq } from 'drizzle-orm';
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
}
