import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { createHmac, timingSafeEqual } from 'node:crypto';

@Injectable()
export class GithubWebhookService {
  private readonly logger = new Logger(GithubWebhookService.name);

  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
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
    if (!event) {
      throw new InternalServerErrorException('GitHub event name is missing');
    }

    this.logger.log(
      `GitHub webhook received: event=${event}, delivery=${deliveryId}`,
    );

    /*
     * Next phase:
     *
     * installation
     * installation_repositories
     * push
     * pull_request
     * issues
     * issue_comment
     */

    return {
      received: true,
      event,
      deliveryId,
    };
  }
}
