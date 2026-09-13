import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [UsersModule, RealtimeModule],

  controllers: [NotificationsController],

  providers: [NotificationsService],

  exports: [NotificationsService],
})
export class NotificationsModule {}
