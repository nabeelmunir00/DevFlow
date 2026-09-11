import { Module } from '@nestjs/common';

import { RbacModule } from '../../common/rbac/rbac.module.js';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';

import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';

@Module({
  imports: [RbacModule, ActivityLogsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
