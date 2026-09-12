import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

import { CreateLabelDto } from './dto/create-label.dto.js';
import { UpdateLabelDto } from './dto/update-label.dto.js';

@Injectable()
export class LabelsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    dto: CreateLabelDto,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const project = await this.databaseService.db.query.projects.findFirst({
      where: (projects, { and, eq, isNull }) =>
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, organizationId),
          isNull(projects.archivedAt),
        ),
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const normalizedName = dto.name.trim();

    const existingLabel = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(eq(labels.projectId, projectId), eq(labels.name, normalizedName)),
    });

    if (existingLabel) {
      throw new BadRequestException(
        'A label with this name already exists in this project',
      );
    }

    const [label] = await this.databaseService.db
      .insert(schema.labels)
      .values({
        organizationId,
        projectId,
        createdById: currentUser.id,
        name: normalizedName,
        color: dto.color.toUpperCase(),
      })
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'LABEL_CREATED',
      entityType: 'PROJECT',
      entityId: projectId,
      metadata: {
        labelId: label.id,
        name: label.name,
        color: label.color,
      },
    });

    return {
      message: 'Label created successfully',
      label,
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

    const labels = await this.databaseService.db.query.labels.findMany({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),

      orderBy: (labels, { asc }) => [asc(labels.name)],
    });

    return {
      projectId,
      labels,
    };
  }

  async findOne(organizationId: string, projectId: string, labelId: string) {
    const label = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.id, labelId),
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }

  async update(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    labelId: string,
    dto: UpdateLabelDto,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const label = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.id, labelId),
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    if (dto.name !== undefined) {
      const normalizedName = dto.name.trim();

      const duplicate = await this.databaseService.db.query.labels.findFirst({
        where: (labels, { and, eq }) =>
          and(eq(labels.projectId, projectId), eq(labels.name, normalizedName)),
      });

      if (duplicate && duplicate.id !== labelId) {
        throw new BadRequestException(
          'A label with this name already exists in this project',
        );
      }
    }

    const [updatedLabel] = await this.databaseService.db
      .update(schema.labels)
      .set({
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),

        ...(dto.color !== undefined ? { color: dto.color.toUpperCase() } : {}),

        updatedAt: new Date(),
      })
      .where(eq(schema.labels.id, labelId))
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'LABEL_UPDATED',
      entityType: 'PROJECT',
      entityId: projectId,
      metadata: {
        labelId,
        name: updatedLabel.name,
        color: updatedLabel.color,
      },
    });

    return {
      message: 'Label updated successfully',
      label: updatedLabel,
    };
  }

  async remove(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    labelId: string,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const label = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.id, labelId),
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    await this.databaseService.db
      .delete(schema.labels)
      .where(eq(schema.labels.id, labelId));

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'LABEL_DELETED',
      entityType: 'PROJECT',
      entityId: projectId,
      metadata: {
        labelId,
        name: label.name,
      },
    });

    return {
      message: 'Label deleted successfully',
      label,
    };
  }

  async attachToTask(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    labelId: string,
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

    const label = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.id, labelId),
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    const existing = await this.databaseService.db.query.taskLabels.findFirst({
      where: (taskLabels, { and, eq }) =>
        and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)),
    });

    if (existing) {
      throw new BadRequestException('Label is already attached to this task');
    }

    const [taskLabel] = await this.databaseService.db
      .insert(schema.taskLabels)
      .values({
        taskId,
        labelId,
      })
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'LABEL_ATTACHED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        labelId,
        labelName: label.name,
      },
    });

    return {
      message: 'Label attached to task successfully',
      taskLabel,
      label,
    };
  }

  async getTaskLabels(
    organizationId: string,
    projectId: string,
    taskId: string,
  ) {
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

    const rows = await this.databaseService.db
      .select({
        id: schema.labels.id,
        name: schema.labels.name,
        color: schema.labels.color,
        createdAt: schema.labels.createdAt,
      })
      .from(schema.taskLabels)
      .innerJoin(schema.labels, eq(schema.taskLabels.labelId, schema.labels.id))
      .where(eq(schema.taskLabels.taskId, taskId));

    return {
      taskId,
      labels: rows,
    };
  }

  async detachFromTask(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    labelId: string,
  ) {
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

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

    const label = await this.databaseService.db.query.labels.findFirst({
      where: (labels, { and, eq }) =>
        and(
          eq(labels.id, labelId),
          eq(labels.organizationId, organizationId),
          eq(labels.projectId, projectId),
        ),
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    const existing = await this.databaseService.db.query.taskLabels.findFirst({
      where: (taskLabels, { and, eq }) =>
        and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)),
    });

    if (!existing) {
      throw new NotFoundException('Label is not attached to this task');
    }

    await this.databaseService.db
      .delete(schema.taskLabels)
      .where(
        and(
          eq(schema.taskLabels.taskId, taskId),
          eq(schema.taskLabels.labelId, labelId),
        ),
      );

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'LABEL_DETACHED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        labelId,
        labelName: label.name,
      },
    });

    return {
      message: 'Label detached from task successfully',
    };
  }
}
