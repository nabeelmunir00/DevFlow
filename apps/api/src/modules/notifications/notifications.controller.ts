import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
@UseGuards(ClerkAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() clerkUserId: { userId: string }) {
    return this.notificationsService.findAll(clerkUserId.userId);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() clerkUserId: { userId: string }) {
    return this.notificationsService.getUnreadCount(clerkUserId.userId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() clerkUserId: { userId: string }) {
    return this.notificationsService.markAllAsRead(clerkUserId.userId);
  }

  @Patch(':notificationId/read')
  markAsRead(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(
      clerkUserId.userId,
      notificationId,
    );
  }

  @Delete(':notificationId')
  remove(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.remove(clerkUserId.userId, notificationId);
  }
}
