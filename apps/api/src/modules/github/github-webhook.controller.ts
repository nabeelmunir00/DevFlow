import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Post,
  Req,
} from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { GithubWebhookService } from './github-webhook.service.js';
import { GithubWebhookDeliveryService } from './github-webhook-delivery.service.js';
import { GithubWebhookQueueService } from './queue/github-webhook-queue.service.js';

@Controller('github/webhooks')
export class GithubWebhookController {
  constructor(
    private readonly githubWebhookService: GithubWebhookService,
    private readonly githubWebhookDeliveryService: GithubWebhookDeliveryService,
    private readonly githubWebhookQueueService: GithubWebhookQueueService,
  ) {}

  @Post()
  async handleWebhook(
    @Req()
    request: RawBodyRequest<Request>,

    @Headers('x-hub-signature-256')
    signature?: string,

    @Headers('x-github-event')
    event?: string,

    @Headers('x-github-delivery')
    deliveryId?: string,
  ) {
    if (!request.rawBody) {
      throw new BadRequestException('Webhook raw body is missing');
    }

    if (!event) {
      throw new BadRequestException('X-GitHub-Event header is missing');
    }

    if (!deliveryId) {
      throw new BadRequestException('X-GitHub-Delivery header is missing');
    }

    this.githubWebhookService.verifySignature(request.rawBody, signature);

    const body = request.body as {
      action?: unknown;
      [key: string]: unknown;
    };

    const action = typeof body?.action === 'string' ? body.action : null;

    const claim = await this.githubWebhookDeliveryService.claimDelivery(
      deliveryId,
      event,
      action,
    );

    if (!claim.claimed) {
      return {
        received: true,
        duplicate: true,
        deliveryId,
        event,
      };
    }

    try {
      await this.githubWebhookQueueService.enqueue({
        event,
        deliveryId,
        body: request.body,
      });

      return {
        received: true,
        queued: true,
        duplicate: false,
        deliveryId,
        event,
      };
    } catch (error) {
      await this.githubWebhookDeliveryService.markFailed(deliveryId);

      throw error;
    }
  }

  @Get('test-signature')
  getTestSignature() {
    const payload = '{"test":true}';

    return {
      payload,
      signature: this.githubWebhookService.generateTestSignature(payload),
    };
  }
}
