import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { Job, Worker } from 'bullmq';

import { RedisService } from '../redis/redis.service.js';
import { EmailService } from '../modules/email/email.service.js';

import type { OrganizationInvitationEmailJob } from './email-queue.service.js';

@Injectable()
export class EmailWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailWorker.name);

  private worker?: Worker;

  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    this.worker = new Worker(
      'email',

      async (job: Job<OrganizationInvitationEmailJob>) => {
        this.logger.log(`Processing email job ${job.id} - ${job.name}`);

        switch (job.name) {
          case 'send-organization-invitation':
            await this.emailService.sendOrganizationInvitation({
              to: job.data.to,
              organizationName: job.data.organizationName,
              inviterName: job.data.inviterName,
              role: job.data.role,
              inviteUrl: job.data.inviteUrl,
              expiresAt: new Date(job.data.expiresAt),
            });

            break;

          default:
            throw new Error(`Unknown email job: ${job.name}`);
        }
      },

      {
        connection: this.redisService.getClient(),
        concurrency: 5,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Email job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Email job ${job?.id} failed: ${error.message}`);
    });

    this.logger.log('Email worker started');
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }
}
