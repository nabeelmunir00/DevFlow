import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    dto: CreateTaskDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const project = await this.databaseService.db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, organizationId),
        ),
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status === 'ARCHIVED') {
      throw new BadRequestException(
        'Cannot create a task in an archived project',
      );
    }

    const assigneeId = dto.assigneeId;

    if (assigneeId) {
      const organizationMember =
        await this.databaseService.db.query.organizationMembers.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.organizationId, organizationId),
              eq(members.userId, assigneeId),
            ),
        });

      if (!organizationMember) {
        throw new BadRequestException(
          'Assignee must be a member of this organization',
        );
      }
    }

    const completedAt = dto.status === 'DONE' ? new Date() : null;

    const [task] = await this.databaseService.db
      .insert(schema.tasks)
      .values({
        organizationId,
        projectId,
        reporterId: currentUser.id,
        assigneeId: assigneeId ?? null,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        status: dto.status ?? 'TODO',
        priority: dto.priority ?? 'MEDIUM',
        position: dto.position ?? 0,
        estimateMinutes: dto.estimateMinutes ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        completedAt,
      })
      .returning();

    return {
      message: 'Task created successfully',
      task,
    };
  }
  async findAll(organizationId: string, projectId: string) {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, organizationId),
        ),
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasks = await this.databaseService.db.query.tasks.findMany({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),

      orderBy: (tasks, { asc, desc }) => [
        asc(tasks.position),
        desc(tasks.createdAt),
      ],
    });

    return tasks;
  }
  async findOne(organizationId: string, projectId: string, taskId: string) {
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

    return task;
  }
  async update(
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ) {
    const existingTask = await this.databaseService.db.query.tasks.findFirst({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.id, taskId),
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const assigneeId = dto.assigneeId;

    if (assigneeId) {
      const organizationMember =
        await this.databaseService.db.query.organizationMembers.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.organizationId, organizationId),
              eq(members.userId, assigneeId),
            ),
        });

      if (!organizationMember) {
        throw new BadRequestException(
          'Assignee must be a member of this organization',
        );
      }
    }

    let completedAt = existingTask.completedAt;

    if (dto.status === 'DONE' && existingTask.status !== 'DONE') {
      completedAt = new Date();
    }

    if (dto.status && dto.status !== 'DONE') {
      completedAt = null;
    }

    const [updatedTask] = await this.databaseService.db
      .update(schema.tasks)
      .set({
        ...(dto.title !== undefined && {
          title: dto.title.trim(),
        }),

        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),

        ...(dto.assigneeId !== undefined && {
          assigneeId: dto.assigneeId,
        }),

        ...(dto.status !== undefined && {
          status: dto.status,
          completedAt,
        }),

        ...(dto.priority !== undefined && {
          priority: dto.priority,
        }),

        ...(dto.position !== undefined && {
          position: dto.position,
        }),

        ...(dto.estimateMinutes !== undefined && {
          estimateMinutes: dto.estimateMinutes,
        }),

        ...(dto.dueDate !== undefined && {
          dueDate: new Date(dto.dueDate),
        }),

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.tasks.id, taskId),
          eq(schema.tasks.organizationId, organizationId),
          eq(schema.tasks.projectId, projectId),
        ),
      )
      .returning();

    return {
      message: 'Task updated successfully',
      task: updatedTask,
    };
  }
}
