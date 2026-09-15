import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { RolesGuard } from '../../../common/rbac/roles.guard.js';
import { Roles } from '../../../common/rbac/roles.decorator.js';

import { GithubTaskLinksService } from './github-task-links.service.js';

@Controller('organizations/:organizationId/tasks/:taskId/github')
@UseGuards(ClerkAuthGuard)
export class GithubTaskLinksController {
  constructor(
    private readonly githubTaskLinksService: GithubTaskLinksService,
  ) {}

  // =====================================================
  // GET ALL GITHUB LINKS
  // =====================================================

  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  getLinks(
    @Param('organizationId')
    organizationId: string,

    @Param('taskId')
    taskId: string,
  ) {
    return this.githubTaskLinksService.getTaskGithubLinks(
      organizationId,
      taskId,
    );
  }

  // =====================================================
  // LINK PULL REQUEST
  // =====================================================

  @Post('pull-requests/:pullRequestId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  linkPullRequest(
    @Param('organizationId')
    organizationId: string,

    @Param('taskId')
    taskId: string,

    @Param('pullRequestId')
    pullRequestId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubTaskLinksService.linkPullRequest(
      organizationId,
      taskId,
      pullRequestId,
      clerkUserId.userId,
    );
  }

  // =====================================================
  // UNLINK PULL REQUEST
  // =====================================================

  @Delete('pull-requests/:pullRequestId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  unlinkPullRequest(
    @Param('organizationId')
    organizationId: string,

    @Param('taskId')
    taskId: string,

    @Param('pullRequestId')
    pullRequestId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubTaskLinksService.unlinkPullRequest(
      organizationId,
      taskId,
      pullRequestId,
      clerkUserId.userId,
    );
  }

  // =====================================================
  // LINK ISSUE
  // =====================================================

  @Post('issues/:issueId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  linkIssue(
    @Param('organizationId')
    organizationId: string,

    @Param('taskId')
    taskId: string,

    @Param('issueId')
    issueId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubTaskLinksService.linkIssue(
      organizationId,
      taskId,
      issueId,
      clerkUserId.userId,
    );
  }

  // =====================================================
  // UNLINK ISSUE
  // =====================================================

  @Delete('issues/:issueId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER')
  unlinkIssue(
    @Param('organizationId')
    organizationId: string,

    @Param('taskId')
    taskId: string,

    @Param('issueId')
    issueId: string,

    @CurrentUser()
    clerkUserId: { userId: string },
  ) {
    return this.githubTaskLinksService.unlinkIssue(
      organizationId,
      taskId,
      issueId,
      clerkUserId.userId,
    );
  }
}
