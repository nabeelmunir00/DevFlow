import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';

@Module({
  imports: [
    ActivityLogsModule,
    NotificationsModule,
    RealtimeModule,
    RbacModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
