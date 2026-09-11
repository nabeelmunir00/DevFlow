import { Injectable, NotFoundException } from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

interface CreateNotificationInput {
  organizationId?: string;
  userId: string;

  type:
    | 'TASK_ASSIGNED'
    | 'TASK_STATUS_CHANGED'
    | 'TASK_COMMENTED'
    | 'ORGANIZATION_INVITATION'
    | 'PROJECT_UPDATED'
    | 'SPRINT_UPDATED'
    | 'GENERAL';

  title: string;
  message: string;

  entityType?: string;
  entityId?: string;

  metadata?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(input: CreateNotificationInput) {
    const [notification] = await this.databaseService.db
      .insert(schema.notifications)
      .values({
        organizationId: input.organizationId,
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      })
      .returning();

    return notification;
  }

  async findAll(clerkUserId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    return this.databaseService.db.query.notifications.findMany({
      where: (notifications, { eq }) =>
        eq(notifications.userId, currentUser.id),

      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });
  }

  async getUnreadCount(clerkUserId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const notifications =
      await this.databaseService.db.query.notifications.findMany({
        where: (notifications, { and, eq }) =>
          and(
            eq(notifications.userId, currentUser.id),
            eq(notifications.isRead, false),
          ),
      });

    return {
      unreadCount: notifications.length,
    };
  }

  async markAsRead(clerkUserId: string, notificationId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const notification =
      await this.databaseService.db.query.notifications.findFirst({
        where: (notifications, { and, eq }) =>
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, currentUser.id),
          ),
      });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const readAt = new Date();

    const [updatedNotification] = await this.databaseService.db
      .update(schema.notifications)
      .set({
        isRead: true,
        readAt,
      })
      .where(
        and(
          eq(schema.notifications.id, notificationId),
          eq(schema.notifications.userId, currentUser.id),
        ),
      )
      .returning();

    return updatedNotification;
  }

  async markAllAsRead(clerkUserId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const readAt = new Date();

    await this.databaseService.db
      .update(schema.notifications)
      .set({
        isRead: true,
        readAt,
      })
      .where(
        and(
          eq(schema.notifications.userId, currentUser.id),
          eq(schema.notifications.isRead, false),
        ),
      );

    return {
      message: 'All notifications marked as read',
    };
  }

  async remove(clerkUserId: string, notificationId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const [deletedNotification] = await this.databaseService.db
      .delete(schema.notifications)
      .where(
        and(
          eq(schema.notifications.id, notificationId),
          eq(schema.notifications.userId, currentUser.id),
        ),
      )
      .returning();

    if (!deletedNotification) {
      throw new NotFoundException('Notification not found');
    }

    return {
      message: 'Notification deleted successfully',
    };
  }
}
