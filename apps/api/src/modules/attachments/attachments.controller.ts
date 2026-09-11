import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

import { AttachmentsService } from './attachments.service.js';

import { Roles } from '../../common/rbac/roles.decorator.js';
import { RolesGuard } from '../../common/rbac/roles.guard.js';
import type { UploadedFileType } from './types/uploaded-file.type.js';

@Controller(
  'organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments',
)
@UseGuards(ClerkAuthGuard, RolesGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  upload(
    @CurrentUser() clerkUserId: { userId: string },
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @UploadedFile() file: UploadedFileType,
  ) {
    return this.attachmentsService.upload(
      clerkUserId.userId,
      organizationId,
      projectId,
      taskId,
      file,
    );
  }

  @Get()
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  findAll(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.attachmentsService.findAll(organizationId, projectId, taskId);
  }

  @Get(':attachmentId/download')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER', 'VIEWER')
  getDownloadUrl(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attachmentsService.getDownloadUrl(
      organizationId,
      projectId,
      taskId,
      attachmentId,
    );
  }

  @Delete(':attachmentId')
  @Roles('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'MEMBER')
  remove(
    @Param('organizationId') organizationId: string,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attachmentsService.remove(
      organizationId,
      projectId,
      taskId,
      attachmentId,
    );
  }
}
