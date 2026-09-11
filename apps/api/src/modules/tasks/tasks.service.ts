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
import { MoveTaskDto } from './dto/move-task.dto.js';
import { ReorderTasksDto } from './dto/reorder-tasks.dto.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly activityLogsService: ActivityLogsService,
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

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'TASK_CREATED',
      entityType: 'TASK',
      entityId: task.id,
      metadata: {
        title: task.title,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
      },
    });

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
  async archive(organizationId: string, projectId: string, taskId: string) {
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

    const now = new Date();

    const [archivedTask] = await this.databaseService.db
      .update(schema.tasks)
      .set({
        archivedAt: now,
        updatedAt: now,
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
      message: 'Task archived successfully',
      task: archivedTask,
    };
  }
  async moveToSprint(
    organizationId: string,
    projectId: string,
    taskId: string,
    sprintId?: string,
  ) {
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

    if (sprintId) {
      const sprint = await this.databaseService.db.query.sprints.findFirst({
        where: (sprints, { and, eq }) =>
          and(
            eq(sprints.id, sprintId),
            eq(sprints.organizationId, organizationId),
            eq(sprints.projectId, projectId),
          ),
      });

      if (!sprint) {
        throw new NotFoundException('Sprint not found');
      }

      if (sprint.status === 'COMPLETED' || sprint.status === 'CANCELLED') {
        throw new BadRequestException(
          'Task cannot be moved to a completed or cancelled sprint',
        );
      }
    }

    const [updatedTask] = await this.databaseService.db
      .update(schema.tasks)
      .set({
        sprintId: sprintId ?? null,
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
      message: sprintId
        ? 'Task moved to sprint successfully'
        : 'Task moved to backlog successfully',
      task: updatedTask,
    };
  }
  async moveTask(
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: MoveTaskDto,
  ) {
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

    let completedAt = task.completedAt;

    if (dto.status === 'DONE' && task.status !== 'DONE') {
      completedAt = new Date();
    }

    if (dto.status !== 'DONE') {
      completedAt = null;
    }

    const [updatedTask] = await this.databaseService.db
      .update(schema.tasks)
      .set({
        status: dto.status,
        position: dto.position ?? task.position,
        completedAt,
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
    if (task.status !== updatedTask.status) {
      await this.activityLogsService.create({
        organizationId,
        projectId,
        actorId: task.reporterId,
        action: 'TASK_STATUS_CHANGED',
        entityType: 'TASK',
        entityId: task.id,
        metadata: {
          from: task.status,
          to: updatedTask.status,
          position: updatedTask.position,
        },
      });
    }

    return {
      message: 'Task moved successfully',
      task: updatedTask,
    };
  }
  async getKanbanBoard(
    organizationId: string,
    projectId: string,
    sprintId?: string,
  ) {
    // Project verify
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

    // Tasks fetch
    const tasks = await this.databaseService.db.query.tasks.findMany({
      where: (tasks, { and, eq, isNull }) => {
        const conditions = [
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ];

        if (sprintId) {
          conditions.push(eq(tasks.sprintId, sprintId));
        }

        return and(...conditions);
      },

      orderBy: (tasks, { asc }) => [asc(tasks.position), asc(tasks.createdAt)],
    });

    return {
      projectId,
      sprintId: sprintId ?? null,

      columns: {
        TODO: tasks.filter((task) => task.status === 'TODO'),

        IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS'),

        IN_REVIEW: tasks.filter((task) => task.status === 'IN_REVIEW'),

        DONE: tasks.filter((task) => task.status === 'DONE'),

        CANCELLED: tasks.filter((task) => task.status === 'CANCELLED'),
      },
    };
  }
  async reorderTasks(
    organizationId: string,
    projectId: string,
    dto: ReorderTasksDto,
  ) {
    const taskIds = dto.tasks.map((task) => task.id);

    // Duplicate IDs reject
    if (new Set(taskIds).size !== taskIds.length) {
      throw new BadRequestException('Duplicate task IDs are not allowed');
    }

    // Make sure every task actually belongs to this project/org
    const existingTasks = await this.databaseService.db.query.tasks.findMany({
      where: (tasks, { and, eq, inArray, isNull }) =>
        and(
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          inArray(tasks.id, taskIds),
          isNull(tasks.archivedAt),
        ),
    });

    if (existingTasks.length !== taskIds.length) {
      throw new BadRequestException(
        'One or more tasks are invalid or archived',
      );
    }

    await this.databaseService.db.transaction(async (tx) => {
      for (const item of dto.tasks) {
        const existingTask = existingTasks.find((task) => task.id === item.id);

        if (!existingTask) {
          throw new BadRequestException('Task not found');
        }

        let completedAt = existingTask.completedAt;

        if (item.status === 'DONE' && existingTask.status !== 'DONE') {
          completedAt = new Date();
        }

        if (item.status !== 'DONE') {
          completedAt = null;
        }

        await tx
          .update(schema.tasks)
          .set({
            status: item.status,
            position: item.position,
            completedAt,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.tasks.id, item.id),
              eq(schema.tasks.organizationId, organizationId),
              eq(schema.tasks.projectId, projectId),
            ),
          );
      }
    });

    return {
      message: 'Tasks reordered successfully',
      updated: dto.tasks.length,
    };
  }
}
