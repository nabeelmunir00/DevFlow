import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service.js';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async testEmail() {
    return this.emailService.sendOrganizationInvitation({
      to: 'nabeelgaming786yt@gmail.com',
      organizationName: 'DevFlow Test',
      inviterName: 'Nabeel',
      role: 'DEVELOPER',
      inviteUrl: 'http://localhost:3000/invitations/test-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}
