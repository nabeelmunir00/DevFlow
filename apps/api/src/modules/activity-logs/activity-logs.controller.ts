import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ActivityLogsService } from './activity-logs.service.js';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

@Controller(
  'organizations/:organizationId/projects/:projectId/tasks/:taskId/activities',
)
@UseGuards(ClerkAuthGuard)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  getTaskTimeline(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.activityLogsService.getTaskTimeline(
      organizationId,
      projectId,
      taskId,
    );
  }
}
