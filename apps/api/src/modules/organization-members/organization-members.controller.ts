import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { OrganizationMembersService } from './organization-members.service.js';
import { AddOrganizationMemberDto } from './dto/add-organization-member.dto.js';

@Controller('organizations/:organizationId/members')
@UseGuards(ClerkAuthGuard)
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
  ) {}

  @Post()
  addMember(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Body()
    dto: AddOrganizationMemberDto,
  ) {
    return this.organizationMembersService.addMember(
      auth.userId,
      organizationId,
      dto,
    );
  }
}
