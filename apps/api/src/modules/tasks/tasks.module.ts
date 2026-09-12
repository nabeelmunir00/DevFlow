import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';

import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [
    UsersModule,
    RbacModule,
    ActivityLogsModule,
    NotificationsModule,
    RealtimeModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
