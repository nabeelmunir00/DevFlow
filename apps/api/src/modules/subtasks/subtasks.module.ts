import { Module } from '@nestjs/common';

import { SubtasksController } from './subtasks.controller.js';
import { SubtasksService } from './subtasks.service.js';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [ActivityLogsModule, RbacModule, RealtimeModule],

  controllers: [SubtasksController],

  providers: [SubtasksService],

  exports: [SubtasksService],
})
export class SubtasksModule {}
