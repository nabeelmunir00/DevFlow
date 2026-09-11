import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from './modules/auth/guards/clerk-auth.guard.js';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator.js';
import { QueueService } from './queue/queue.service.js';

@Controller()
export class AppController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  getHello() {
    return {
      name: 'DevFlow API',
      status: 'running',
    };
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  getMe(@CurrentUser() clerkUserId: string) {
    return {
      authenticated: true,
      clerkUserId,
    };
  }

  @Post('queue/test')
  async testQueue() {
    const job = await this.queueService.addTestJob({
      message: 'Hello from DevFlow BullMQ 🚀',
      timestamp: new Date().toISOString(),
    });

    return {
      message: 'Job added to queue',
      jobId: job.id,
    };
  }
}
