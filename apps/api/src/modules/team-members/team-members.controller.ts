import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { TeamMembersService } from './team-members.service.js';
import { AddTeamMemberDto } from './dto/add-team-member.dto.js';

@Controller('organizations/:organizationId/teams/:teamId/members')
@UseGuards(ClerkAuthGuard)
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  addMember(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('teamId', new ParseUUIDPipe())
    teamId: string,

    @Body()
    dto: AddTeamMemberDto,
  ) {
    return this.teamMembersService.addMember(organizationId, teamId, dto);
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('teamId', new ParseUUIDPipe())
    teamId: string,
  ) {
    return this.teamMembersService.findAll(organizationId, teamId);
  }
}
