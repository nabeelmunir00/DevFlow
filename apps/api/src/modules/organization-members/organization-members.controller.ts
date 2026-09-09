import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { OrganizationMembersService } from './organization-members.service.js';

import { UpdateOrganizationMemberRoleDto } from './dto/update-organization-member-role.dto.js';

@Controller('organizations/:organizationId/members')
@UseGuards(ClerkAuthGuard)
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
  ) {}

  @Get()
  findAll(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,
  ) {
    return this.organizationMembersService.findAll(auth.userId, organizationId);
  }

  @Patch(':memberId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  updateRole(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('memberId', new ParseUUIDPipe())
    memberId: string,

    @Body()
    dto: UpdateOrganizationMemberRoleDto,
  ) {
    return this.organizationMembersService.updateRole(
      auth.userId,
      organizationId,
      memberId,
      dto,
    );
  }

  @Delete(':memberId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  remove(
    @CurrentUser()
    auth: { userId: string },

    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('memberId', new ParseUUIDPipe())
    memberId: string,
  ) {
    return this.organizationMembersService.remove(
      auth.userId,
      organizationId,
      memberId,
    );
  }
}
