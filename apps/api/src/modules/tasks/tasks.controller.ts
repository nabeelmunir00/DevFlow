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

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { MoveTaskToSprintDto } from './dto/move-task-to-sprint.dto.js';

@Controller('organizations/:organizationId/projects/:projectId/tasks')
@UseGuards(ClerkAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  create(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      clerkUserId.userId,
      organizationId,
      projectId,
      dto,
    );
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAll(organizationId, projectId);
  }
  @Get(':taskId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findOne(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.findOne(organizationId, projectId, taskId);
  }
  @Patch(':taskId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  update(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(organizationId, projectId, taskId, dto);
  }
  @Delete(':taskId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  archive(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.archive(organizationId, projectId, taskId);
  }
  @Patch(':taskId/sprint')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  moveToSprint(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: MoveTaskToSprintDto,
  ) {
    return this.tasksService.moveToSprint(
      organizationId,
      projectId,
      taskId,
      dto.sprintId,
    );
  }
}
