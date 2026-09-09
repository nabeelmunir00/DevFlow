import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { OrganizationInvitationsController } from './organization-invitations.controller.js';

import { InvitationsController } from './invitations.controller.js';

import { OrganizationInvitationsService } from './organization-invitations.service.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [UsersModule, EmailModule],

  controllers: [OrganizationInvitationsController, InvitationsController],

  providers: [OrganizationInvitationsService],

  exports: [OrganizationInvitationsService],
})
export class OrganizationInvitationsModule {}
