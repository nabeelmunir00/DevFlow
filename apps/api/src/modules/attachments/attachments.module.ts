import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { AttachmentsController } from './attachments.controller.js';
import { AttachmentsService } from './attachments.service.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';

@Module({
  imports: [UsersModule, RbacModule, ActivityLogsModule],

  controllers: [AttachmentsController],

  providers: [AttachmentsService],

  exports: [AttachmentsService],
})
export class AttachmentsModule {}
