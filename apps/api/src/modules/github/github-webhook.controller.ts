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

@Controller('github/webhooks')
export class GithubWebhookController {
  constructor(private readonly githubWebhookService: GithubWebhookService) {}

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

    return this.githubWebhookService.handleEvent(
      event,
      deliveryId,
      request.body,
    );
  }
}
