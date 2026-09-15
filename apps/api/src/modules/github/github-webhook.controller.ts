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

@Controller('github/webhooks')
export class GithubWebhookController {
  constructor(
    private readonly githubWebhookService: GithubWebhookService,
    private readonly githubWebhookDeliveryService: GithubWebhookDeliveryService,
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
    // 1. Raw body is required for GitHub signature verification
    if (!request.rawBody) {
      throw new BadRequestException('Webhook raw body is missing');
    }

    // 2. Required GitHub headers
    if (!event) {
      throw new BadRequestException('X-GitHub-Event header is missing');
    }

    if (!deliveryId) {
      throw new BadRequestException('X-GitHub-Delivery header is missing');
    }

    // 3. Always verify signature BEFORE claiming the delivery
    this.githubWebhookService.verifySignature(request.rawBody, signature);

    // 4. Extract GitHub webhook action when available
    const body = request.body as {
      action?: unknown;
      [key: string]: unknown;
    };

    const action = typeof body?.action === 'string' ? body.action : null;

    // 5. Atomically claim this GitHub delivery
    const claim = await this.githubWebhookDeliveryService.claimDelivery(
      deliveryId,
      event,
      action,
    );

    // 6. Already PROCESSING or COMPLETED -> safely ignore duplicate
    if (!claim.claimed) {
      return {
        received: true,
        duplicate: true,
        deliveryId,
        event,
      };
    }

    try {
      // 7. Process actual GitHub event
      const result = await this.githubWebhookService.handleEvent(
        event,
        deliveryId,
        request.body,
      );

      // 8. Processing succeeded
      await this.githubWebhookDeliveryService.markCompleted(deliveryId);

      return {
        ...result,
        duplicate: false,
      };
    } catch (error) {
      // 9. Processing failed, allowing the same delivery to retry later
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
