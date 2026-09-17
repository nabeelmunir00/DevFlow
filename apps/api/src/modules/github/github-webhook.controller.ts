import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

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

  @SkipThrottle()
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

    /*
     * Verify GitHub HMAC signature against the exact raw
     * request body before accepting the webhook.
     */
    this.githubWebhookService.verifySignature(request.rawBody, signature);

    const body = request.body as {
      action?: unknown;
      [key: string]: unknown;
    };

    const action = typeof body?.action === 'string' ? body.action : null;

    /*
     * Claim delivery before enqueueing.
     *
     * GitHub can retry the same delivery, therefore
     * X-GitHub-Delivery acts as the idempotency key.
     */
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
      /*
       * Actual webhook processing happens asynchronously
       * through the GitHub BullMQ queue.
       */
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
      /*
       * If enqueueing fails, mark the delivery as failed
       * so the failure is visible/recoverable.
       */
      await this.githubWebhookDeliveryService.markFailed(deliveryId);

      throw error;
    }
  }
}
