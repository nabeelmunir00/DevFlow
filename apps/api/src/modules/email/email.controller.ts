import { Controller, Post } from '@nestjs/common';
import { EmailQueueService } from '../../queue/email-queue.service.js';

@Controller('email')
export class EmailController {
  constructor(private readonly emailQueueService: EmailQueueService) {}

  @Post('test')
  async testEmail() {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const job = await this.emailQueueService.addOrganizationInvitationEmail({
      to: 'nabeelgaming786yt@gmail.com',
      organizationName: 'DevFlow Test',
      inviterName: 'Nabeel',
      role: 'DEVELOPER',
      inviteUrl: 'http://localhost:3000/invitations/test-token',
      expiresAt: expiresAt.toISOString(),
    });

    return {
      message: 'Test email queued successfully',
      jobId: job.id,
    };
  }
}
