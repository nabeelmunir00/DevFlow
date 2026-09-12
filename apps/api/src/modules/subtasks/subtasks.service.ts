import { Injectable, NotFoundException } from '@nestjs/common';

import { eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

import { CreateSubtaskDto } from './dto/create-subtask.dto.js';
import { UpdateSubtaskDto } from './dto/update-subtask.dto.js';

@Injectable()
export class SubtasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: CreateSubtaskDto,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const task = await this.databaseService.db.query.tasks.findFirst({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.id, taskId),
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const [subtask] = await this.databaseService.db
      .insert(schema.taskSubtasks)
      .values({
        organizationId,
        projectId,
        taskId,
        createdById: currentUser.id,
        title: dto.title.trim(),
        position: dto.position ?? 0,
      })
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'SUBTASK_CREATED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        subtaskId: subtask.id,
        title: subtask.title,
      },
    });

    return {
      message: 'Subtask created successfully',
      subtask,
    };
  }

  async findAll(organizationId: string, projectId: string, taskId: string) {
    const task = await this.databaseService.db.query.tasks.findFirst({
      where: (tasks, { and, eq }) =>
        and(
          eq(tasks.id, taskId),
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
        ),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const subtasks = await this.databaseService.db.query.taskSubtasks.findMany({
      where: (subtasks, { and, eq }) =>
        and(
          eq(subtasks.organizationId, organizationId),
          eq(subtasks.projectId, projectId),
          eq(subtasks.taskId, taskId),
        ),

      orderBy: (subtasks, { asc }) => [
        asc(subtasks.position),
        asc(subtasks.createdAt),
      ],
    });

    return {
      taskId,
      subtasks,
    };
  }

  async findOne(
    organizationId: string,
    projectId: string,
    taskId: string,
    subtaskId: string,
  ) {
    const subtask = await this.databaseService.db.query.taskSubtasks.findFirst({
      where: (subtasks, { and, eq }) =>
        and(
          eq(subtasks.id, subtaskId),
          eq(subtasks.organizationId, organizationId),
          eq(subtasks.projectId, projectId),
          eq(subtasks.taskId, taskId),
        ),
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    return subtask;
  }

  async update(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    subtaskId: string,
    dto: UpdateSubtaskDto,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const subtask = await this.databaseService.db.query.taskSubtasks.findFirst({
      where: (subtasks, { and, eq }) =>
        and(
          eq(subtasks.id, subtaskId),
          eq(subtasks.organizationId, organizationId),
          eq(subtasks.projectId, projectId),
          eq(subtasks.taskId, taskId),
        ),
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    const wasCompleted = subtask.isCompleted;
    const nowCompleted = dto.isCompleted ?? subtask.isCompleted;

    const updateData: {
      title?: string;
      isCompleted?: boolean;
      position?: number;
      completedAt?: Date | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) {
      updateData.title = dto.title.trim();
    }

    if (dto.position !== undefined) {
      updateData.position = dto.position;
    }

    if (dto.isCompleted !== undefined) {
      updateData.isCompleted = dto.isCompleted;

      updateData.completedAt = dto.isCompleted ? new Date() : null;
    }

    const [updatedSubtask] = await this.databaseService.db
      .update(schema.taskSubtasks)
      .set(updateData)
      .where(eq(schema.taskSubtasks.id, subtaskId))
      .returning();

    let action = 'SUBTASK_UPDATED';

    if (!wasCompleted && nowCompleted) {
      action = 'SUBTASK_COMPLETED';
    }

    if (wasCompleted && !nowCompleted) {
      action = 'SUBTASK_REOPENED';
    }

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action,
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        subtaskId,
        title: updatedSubtask.title,
        isCompleted: updatedSubtask.isCompleted,
      },
    });

    return {
      message: 'Subtask updated successfully',
      subtask: updatedSubtask,
    };
  }

  async remove(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    subtaskId: string,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const subtask = await this.databaseService.db.query.taskSubtasks.findFirst({
      where: (subtasks, { and, eq }) =>
        and(
          eq(subtasks.id, subtaskId),
          eq(subtasks.organizationId, organizationId),
          eq(subtasks.projectId, projectId),
          eq(subtasks.taskId, taskId),
        ),
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    const [deletedSubtask] = await this.databaseService.db
      .delete(schema.taskSubtasks)
      .where(eq(schema.taskSubtasks.id, subtaskId))
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'SUBTASK_DELETED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        subtaskId,
        title: subtask.title,
      },
    });

    return {
      message: 'Subtask deleted successfully',
      subtask: deletedSubtask,
    };
  }
}
