import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

import { CreateCommentDto } from './dto/create-comment.dto.js';
import { eq } from 'drizzle-orm';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

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
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

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

    if (comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only edit your own comment');
    }

    const [updatedComment] = await this.databaseService.db
      .update(schema.taskComments)
      .set({
        content: dto.content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(schema.taskComments.id, commentId))
      .returning();

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
    const currentUser = await this.databaseService.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.externalAuthId, clerkUserId),
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

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

    if (comment.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    const deletedAt = new Date();

    const [deletedComment] = await this.databaseService.db
      .update(schema.taskComments)
      .set({
        deletedAt,
        updatedAt: deletedAt,
      })
      .where(eq(schema.taskComments.id, commentId))
      .returning();

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

    return {
      message: 'Comment deleted successfully',
      comment: deletedComment,
    };
  }
}
