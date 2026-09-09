import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { TeamsService } from './teams.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';

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
}
