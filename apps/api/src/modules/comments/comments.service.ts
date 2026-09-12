import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';

import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

import { eq } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly notificationsService: NotificationsService,
    private readonly realtimeGateway: RealtimeGateway,
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

    // Create comment
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

    // Activity log
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

    // Notify task assignee
    if (task.assigneeId && task.assigneeId !== currentUser.id) {
      await this.notificationsService.create({
        organizationId,
        userId: task.assigneeId,

        type: 'TASK_COMMENTED',

        title: 'New comment on your task',

        message: `${currentUser.name ?? currentUser.email} commented on "${task.title}"`,

        entityType: 'TASK',
        entityId: task.id,

        metadata: {
          projectId,
          taskId: task.id,
          commentId: comment.id,
          commentedBy: currentUser.id,
        },
      });
    }

    // Realtime
    this.realtimeGateway.emitToProject(
      organizationId,
      projectId,
      'comment:created',
      {
        comment,
        taskId,
        actorId: currentUser.id,
      },
    );

    return {
      message: 'Comment created successfully',
      comment,
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

    const comments = await this.databaseService.db.query.taskComments.findMany({
      where: (comments, { and, eq, isNull }) =>
        and(
          eq(comments.organizationId, organizationId),
          eq(comments.projectId, projectId),
          eq(comments.taskId, taskId),
          isNull(comments.deletedAt),
        ),

      orderBy: (comments, { asc }) => [asc(comments.createdAt)],
    });

    return {
      taskId,
      comments,
    };
  }

  async findOne(
    organizationId: string,
    projectId: string,
    taskId: string,
    commentId: string,
  ) {
    const comment = await this.databaseService.db.query.taskComments.findFirst({
      where: (comments, { and, eq, isNull }) =>
        and(
          eq(comments.id, commentId),
          eq(comments.organizationId, organizationId),
          eq(comments.projectId, projectId),
          eq(comments.taskId, taskId),
          isNull(comments.deletedAt),
        ),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ) {
    // Current user
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Comment verify
    const comment = await this.databaseService.db.query.taskComments.findFirst({
      where: (comments, { and, eq, isNull }) =>
        and(
          eq(comments.id, commentId),
          eq(comments.organizationId, organizationId),
          eq(comments.projectId, projectId),
          eq(comments.taskId, taskId),
          isNull(comments.deletedAt),
        ),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Author ownership check
    if (comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only edit your own comment');
    }

    // Update comment
    const [updatedComment] = await this.databaseService.db
      .update(schema.taskComments)
      .set({
        content: dto.content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(schema.taskComments.id, commentId))
      .returning();

    // Activity
    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'COMMENT_UPDATED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        commentId,
      },
    });

    // Realtime
    this.realtimeGateway.emitToProject(
      organizationId,
      projectId,
      'comment:updated',
      {
        comment: updatedComment,
        taskId,
        actorId: currentUser.id,
      },
    );

    return {
      message: 'Comment updated successfully',
      comment: updatedComment,
    };
  }

  async remove(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    commentId: string,
  ) {
    // Current user
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Comment verify
    const comment = await this.databaseService.db.query.taskComments.findFirst({
      where: (comments, { and, eq, isNull }) =>
        and(
          eq(comments.id, commentId),
          eq(comments.organizationId, organizationId),
          eq(comments.projectId, projectId),
          eq(comments.taskId, taskId),
          isNull(comments.deletedAt),
        ),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Ownership check
    if (comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    const deletedAt = new Date();

    // Soft delete
    const [deletedComment] = await this.databaseService.db
      .update(schema.taskComments)
      .set({
        deletedAt,
        updatedAt: deletedAt,
      })
      .where(eq(schema.taskComments.id, commentId))
      .returning();

    // Activity
    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'COMMENT_DELETED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        commentId,
      },
    });

    // Realtime
    this.realtimeGateway.emitToProject(
      organizationId,
      projectId,
      'comment:deleted',
      {
        commentId,
        taskId,
        actorId: currentUser.id,
      },
    );

    return {
      message: 'Comment deleted successfully',
      comment: deletedComment,
    };
  }
}
