import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { OrganizationInvitationsService } from './organization-invitations.service.js';

@Controller('invitations')
@UseGuards(ClerkAuthGuard)
export class InvitationsController {
  constructor(
    private readonly organizationInvitationsService: OrganizationInvitationsService,
  ) {}

  @Post(':token/accept')
  accept(
    @CurrentUser()
    auth: { userId: string },

    @Param('token')
    token: string,
  ) {
    return this.organizationInvitationsService.accept(auth.userId, token);
  }
}
