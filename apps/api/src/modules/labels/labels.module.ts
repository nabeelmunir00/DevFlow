import { Module } from '@nestjs/common';

import { LabelsController } from './labels.controller.js';
import { LabelsService } from './labels.service.js';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';
import { RealtimeModule } from '../realtime/realtime.module.js';

@Module({
  imports: [ActivityLogsModule, RbacModule, RealtimeModule],

  controllers: [LabelsController],

  providers: [LabelsService],

  exports: [LabelsService],
})
export class LabelsModule {}
