import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { MoveTaskDto } from './dto/move-task.dto.js';
import { ReorderTasksDto } from './dto/reorder-tasks.dto.js';

@Controller('organizations/:organizationId/projects/:projectId/tasks')
@UseGuards(ClerkAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ============================================================
  // CREATE TASK
  // POST /organizations/:organizationId/projects/:projectId/tasks
  // ============================================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  create(
    @CurrentUser() clerkUserId: string,
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      clerkUserId,
      organizationId,
      projectId,
      dto,
    );
  }

  // ============================================================
  // GET ALL TASKS
  // GET /organizations/:organizationId/projects/:projectId/tasks
  // ============================================================

  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAll(organizationId, projectId);
  }

  // ============================================================
  // GET KANBAN BOARD
  // IMPORTANT: STATIC ROUTE BEFORE :taskId
  // GET /tasks/board/kanban
  // GET /tasks/board/kanban?sprintId=...
  // ============================================================

  @Get('board/kanban')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  getKanbanBoard(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Query('sprintId') sprintId?: string,
  ) {
    return this.tasksService.getKanbanBoard(
      organizationId,
      projectId,
      sprintId,
    );
  }

  // ============================================================
  // REORDER TASKS
  // IMPORTANT: STATIC ROUTE BEFORE :taskId
  // PATCH /tasks/reorder
  // ============================================================

  @Patch('reorder')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  reorderTasks(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Body() dto: ReorderTasksDto,
  ) {
    return this.tasksService.reorderTasks(organizationId, projectId, dto);
  }

  // ============================================================
  // MOVE TASK TO SPRINT / BACKLOG
  // PATCH /tasks/:taskId/sprint
  // ============================================================

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

  // ============================================================
  // MOVE TASK ON KANBAN
  // PATCH /tasks/:taskId/move
  // ============================================================

  @Patch(':taskId/move')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  moveTask(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasksService.moveTask(organizationId, projectId, taskId, dto);
  }

  // ============================================================
  // GET SINGLE TASK
  // DYNAMIC ROUTE AFTER STATIC ROUTES
  // GET /tasks/:taskId
  // ============================================================

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

  // ============================================================
  // UPDATE TASK
  // PATCH /tasks/:taskId
  // ============================================================

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

  // ============================================================
  // ARCHIVE TASK
  // DELETE /tasks/:taskId
  // ============================================================

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
}
