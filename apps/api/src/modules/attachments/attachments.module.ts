import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

import { AttachmentsController } from './attachments.controller.js';
import { AttachmentsService } from './attachments.service.js';

@Module({
  imports: [UsersModule, RbacModule, ActivityLogsModule, RealtimeModule],

  controllers: [AttachmentsController],

  providers: [AttachmentsService],

  exports: [AttachmentsService],
})
export class AttachmentsModule {}
