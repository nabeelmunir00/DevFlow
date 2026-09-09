import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { TeamsService } from './teams.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';

@Controller('organizations/:organizationId/teams')
@UseGuards(ClerkAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  create(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Body()
    dto: CreateTeamDto,
  ) {
    return this.teamsService.create(organizationId, dto);
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,
  ) {
    return this.teamsService.findAll(organizationId);
  }
  @Get(':teamId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findOne(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('teamId', new ParseUUIDPipe())
    teamId: string,
  ) {
    return this.teamsService.findOne(organizationId, teamId);
  }
  @Patch(':teamId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  update(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('teamId', new ParseUUIDPipe())
    teamId: string,

    @Body()
    dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(organizationId, teamId, dto);
  }
  @Delete(':teamId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN')
  remove(
    @Param('organizationId', new ParseUUIDPipe())
    organizationId: string,

    @Param('teamId', new ParseUUIDPipe())
    teamId: string,
  ) {
    return this.teamsService.remove(organizationId, teamId);
  }
}
