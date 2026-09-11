import { Injectable, NotFoundException } from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

import { CreateCommentDto } from './dto/create-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    dto: CreateCommentDto,
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

    const [comment] = await this.databaseService.db
      .insert(schema.taskComments)
      .values({
        organizationId,
        projectId,
        taskId,
        authorId: currentUser.id,
        content: dto.content.trim(),
      })
      .returning();

    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'COMMENT_CREATED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        commentId: comment.id,
      },
    });

    return {
      message: 'Comment created successfully',
      comment,
    };
  }
}
