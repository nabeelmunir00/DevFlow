import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';

import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@Controller(
  'organizations/:organizationId/projects/:projectId/tasks/:taskId/comments',
)
@UseGuards(ClerkAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  create(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      dto,
    );
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.commentsService.findAll(organizationId, projectId, taskId);
  }

  @Get(':commentId')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findOne(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.findOne(
      organizationId,
      projectId,
      taskId,
      commentId,
    );
  }
}
