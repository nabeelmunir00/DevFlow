import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { LabelsService } from './labels.service.js';
import { CreateLabelDto } from './dto/create-label.dto.js';
import { UpdateLabelDto } from './dto/update-label.dto.js';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';
import { Roles } from '../../common/rbac/roles.decorator.js';

@Controller()
@UseGuards(ClerkAuthGuard, RolesGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  // =========================================================
  // Project Labels
  // =========================================================

  @Post('organizations/:organizationId/projects/:projectId/labels')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  create(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateLabelDto,
  ) {
    return this.labelsService.create(
      clerkUserId.userId,
      organizationId,
      projectId,
      dto,
    );
  }

  @Get('organizations/:organizationId/projects/:projectId/labels')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.labelsService.findAll(organizationId, projectId);
  }

  @Get('organizations/:organizationId/projects/:projectId/labels/:labelId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findOne(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.findOne(organizationId, projectId, labelId);
  }

  @Patch('organizations/:organizationId/projects/:projectId/labels/:labelId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  update(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('labelId') labelId: string,
    @Body() dto: UpdateLabelDto,
  ) {
    return this.labelsService.update(
      clerkUserId.userId,
      organizationId,
      projectId,
      labelId,
      dto,
    );
  }

  @Delete('organizations/:organizationId/projects/:projectId/labels/:labelId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  remove(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.remove(
      clerkUserId.userId,
      organizationId,
      projectId,
      labelId,
    );
  }

  // =========================================================
  // Task Labels
  // =========================================================

  @Post(
    'organizations/:organizationId/projects/:projectId/tasks/:taskId/labels/:labelId',
  )
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  attachToTask(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.attachToTask(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      labelId,
    );
  }

  @Get('organizations/:organizationId/projects/:projectId/tasks/:taskId/labels')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  getTaskLabels(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.labelsService.getTaskLabels(organizationId, projectId, taskId);
  }

  @Delete(
    'organizations/:organizationId/projects/:projectId/tasks/:taskId/labels/:labelId',
  )
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  detachFromTask(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.detachFromTask(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      labelId,
    );
  }
}
