import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';

import { RedisService } from '../redis/redis.service.js';

export interface OrganizationInvitationEmailJob {
  to: string;
  organizationName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
  expiresAt: string;
}

@Injectable()
export class EmailQueueService implements OnModuleDestroy {
  private readonly emailQueue: Queue;

  constructor(private readonly redisService: RedisService) {
    this.emailQueue = new Queue('email', {
      connection: this.redisService.getClient(),
    });
  }

  async addOrganizationInvitationEmail(data: OrganizationInvitationEmailJob) {
    return this.emailQueue.add('send-organization-invitation', data, {
      attempts: 3,

      backoff: {
        type: 'exponential',
        delay: 3000,
      },

      removeOnComplete: 100,
      removeOnFail: 500,
    });
  }

  async onModuleDestroy() {
    await this.emailQueue.close();
  }
}
