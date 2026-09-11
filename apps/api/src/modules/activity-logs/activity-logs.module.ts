import { Module } from '@nestjs/common';

import { ActivityLogsService } from './activity-logs.service.js';
import { ActivityLogsController } from './activity-logs.controller.js';

import { RbacModule } from '../../common/rbac/rbac.module.js';

@Module({
  imports: [RbacModule],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
