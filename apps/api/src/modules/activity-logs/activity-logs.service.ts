import { Injectable } from '@nestjs/common';

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
}
