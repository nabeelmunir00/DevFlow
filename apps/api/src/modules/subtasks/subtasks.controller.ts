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

import { SubtasksService } from './subtasks.service.js';
import { CreateSubtaskDto } from './dto/create-subtask.dto.js';
import { UpdateSubtaskDto } from './dto/update-subtask.dto.js';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

@Controller(
  'organizations/:organizationId/projects/:projectId/tasks/:taskId/subtasks',
)
@UseGuards(ClerkAuthGuard, RolesGuard)
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  create(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      dto,
    );
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.subtasksService.findAll(organizationId, projectId, taskId);
  }

  @Get(':subtaskId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findOne(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.subtasksService.findOne(
      organizationId,
      projectId,
      taskId,
      subtaskId,
    );
  }

  @Patch(':subtaskId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  update(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      subtaskId,
      dto,
    );
  }

  @Delete(':subtaskId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  remove(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.subtasksService.remove(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      subtaskId,
    );
  }
}
