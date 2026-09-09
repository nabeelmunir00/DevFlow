import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { OrganizationInvitationsService } from './organization-invitations.service.js';

import { CreateOrganizationInvitationDto } from './dto/create-organization-invitation.dto.js';

@Controller('organizations/:organizationId/invitations')
@UseGuards(ClerkAuthGuard)
export class OrganizationInvitationsController {
  constructor(
    private readonly organizationInvitationsService: OrganizationInvitationsService,
  ) {}

  @Post()
  create(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Body()
    dto: CreateOrganizationInvitationDto,
  ) {
    return this.organizationInvitationsService.create(
      auth.userId,
      organizationId,
      dto,
    );
  }
  @Get()
  findAll(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,
  ) {
    return this.organizationInvitationsService.findAllForOrganization(
      auth.userId,
      organizationId,
    );
  }
  @Delete(':invitationId')
  revoke(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('invitationId', new ParseUUIDPipe())
    invitationId: string,
  ) {
    return this.organizationInvitationsService.revoke(
      auth.userId,
      organizationId,
      invitationId,
    );
  }
}
