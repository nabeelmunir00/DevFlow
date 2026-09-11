import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service.js';
import { schema } from '@devflow/db';

type CreateActivityLogInput = {
  organizationId: string;
  projectId?: string | null;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
};

@Injectable()
export class ActivityLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CreateActivityLogInput) {
    const [activity] = await this.databaseService.db
      .insert(schema.activityLogs)
      .values({
        organizationId: input.organizationId,
        projectId: input.projectId ?? null,
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        metadata: input.metadata ?? null,
      })
      .returning();

    return activity;
  }
  async getTaskTimeline(
    organizationId: string,
    projectId: string,
    taskId: string,
  ) {
    // Task verify
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

    const activities =
      await this.databaseService.db.query.activityLogs.findMany({
        where: (activityLogs, { and, eq }) =>
          and(
            eq(activityLogs.organizationId, organizationId),
            eq(activityLogs.projectId, projectId),
            eq(activityLogs.entityType, 'TASK'),
            eq(activityLogs.entityId, taskId),
          ),

        orderBy: (activityLogs, { desc }) => [desc(activityLogs.createdAt)],
      });

    return {
      taskId,
      activities,
    };
  }
}
