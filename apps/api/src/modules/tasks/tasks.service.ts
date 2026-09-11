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
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly notificationsService: NotificationsService,
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

    if (task.assigneeId && task.assigneeId !== currentUser.id) {
      await this.notificationsService.create({
        organizationId,
        userId: task.assigneeId,

        type: 'TASK_ASSIGNED',

        title: 'New task assigned',

        message: `${currentUser.name ?? currentUser.email} assigned you "${task.title}"`,

        entityType: 'TASK',
        entityId: task.id,

        metadata: {
          projectId,
          taskId: task.id,
          assignedBy: currentUser.id,
        },
      });
    }

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
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);
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

    const assigneeChanged =
      dto.assigneeId !== undefined &&
      dto.assigneeId !== existingTask.assigneeId;

    if (
      assigneeChanged &&
      updatedTask.assigneeId &&
      updatedTask.assigneeId !== currentUser.id
    ) {
      await this.notificationsService.create({
        organizationId,
        userId: updatedTask.assigneeId,

        type: 'TASK_ASSIGNED',

        title: 'Task assigned to you',

        message: `${currentUser.name ?? currentUser.email} assigned you "${updatedTask.title}"`,

        entityType: 'TASK',
        entityId: updatedTask.id,

        metadata: {
          projectId,
          taskId: updatedTask.id,
          assignedBy: currentUser.id,
          previousAssigneeId: existingTask.assigneeId,
        },
      });
    }

    return {
      message: 'Task updated successfully',
      task: updatedTask,
    };
  }
  async archive(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
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

    const archivedAt = new Date();

    const [archivedTask] = await this.databaseService.db
      .update(schema.tasks)
      .set({
        archivedAt,
        updatedAt: archivedAt,
      })
      .where(
        and(
          eq(schema.tasks.id, taskId),
          eq(schema.tasks.organizationId, organizationId),
          eq(schema.tasks.projectId, projectId),
        ),
      )
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'TASK_ARCHIVED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        title: task.title,
        status: task.status,
        sprintId: task.sprintId,
      },
    });

    return {
      message: 'Task archived successfully',
      task: archivedTask,
    };
  }
  async moveToSprint(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    sprintId?: string,
  ) {
    // Current user
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Task verify
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

    // Sprint verify
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

    const previousSprintId = task.sprintId;

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

    // Only create activity when sprint actually changed
    if (previousSprintId !== updatedTask.sprintId) {
      await this.activityLogsService.create({
        organizationId,
        projectId,
        actorId: currentUser.id,

        action: updatedTask.sprintId
          ? 'TASK_MOVED_TO_SPRINT'
          : 'TASK_MOVED_TO_BACKLOG',

        entityType: 'TASK',
        entityId: taskId,

        metadata: {
          fromSprintId: previousSprintId,
          toSprintId: updatedTask.sprintId,
        },
      });
    }

    return {
      message: updatedTask.sprintId
        ? 'Task moved to sprint successfully'
        : 'Task moved to backlog successfully',

      task: updatedTask,
    };
  }
  async moveTask(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: MoveTaskDto,
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
        actorId: currentUser.id,
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

    if (
      task.status !== updatedTask.status &&
      updatedTask.assigneeId &&
      updatedTask.assigneeId !== currentUser.id
    ) {
      await this.notificationsService.create({
        organizationId,
        userId: updatedTask.assigneeId,

        type: 'TASK_STATUS_CHANGED',

        title: 'Task status changed',

        message: `${currentUser.name ?? currentUser.email} moved "${updatedTask.title}" from ${task.status} to ${updatedTask.status}`,

        entityType: 'TASK',
        entityId: updatedTask.id,

        metadata: {
          projectId,
          taskId: updatedTask.id,
          changedBy: currentUser.id,
          fromStatus: task.status,
          toStatus: updatedTask.status,
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
