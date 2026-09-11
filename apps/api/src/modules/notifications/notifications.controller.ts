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
  findAll(@CurrentUser() clerkUserId: string) {
    return this.notificationsService.findAll(clerkUserId);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() clerkUserId: string) {
    return this.notificationsService.getUnreadCount(clerkUserId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() clerkUserId: string) {
    return this.notificationsService.markAllAsRead(clerkUserId);
  }

  @Patch(':notificationId/read')
  markAsRead(
    @CurrentUser() clerkUserId: string,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(clerkUserId, notificationId);
  }

  @Delete(':notificationId')
  remove(
    @CurrentUser() clerkUserId: string,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.remove(clerkUserId, notificationId);
  }
}
