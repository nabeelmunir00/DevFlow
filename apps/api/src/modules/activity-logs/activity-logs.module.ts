import { Module } from '@nestjs/common';

import { ActivityLogsService } from './activity-logs.service.js';

@Module({
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
