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
import type { Multer } from 'multer';
import type { UploadedFileType } from './types/uploaded-file.type.js';

@Controller(
  'organizations/:organizationId/projects/:projectId/tasks/:taskId/attachments',
)
@UseGuards(ClerkAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  upload(
    @CurrentUser() clerkUserId: { userId: string },

    @Param('organizationId')
    organizationId: string,

    @Param('projectId')
    projectId: string,

    @Param('taskId')
    taskId: string,

    @UploadedFile()
    file: UploadedFileType,
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
  findAll(
    @Param('organizationId')
    organizationId: string,

    @Param('projectId')
    projectId: string,

    @Param('taskId')
    taskId: string,
  ) {
    return this.attachmentsService.findAll(organizationId, projectId, taskId);
  }

  @Get(':attachmentId/download')
  getDownloadUrl(
    @Param('organizationId')
    organizationId: string,

    @Param('projectId')
    projectId: string,

    @Param('taskId')
    taskId: string,

    @Param('attachmentId')
    attachmentId: string,
  ) {
    return this.attachmentsService.getDownloadUrl(
      organizationId,
      projectId,
      taskId,
      attachmentId,
    );
  }

  @Delete(':attachmentId')
  remove(
    @Param('organizationId')
    organizationId: string,

    @Param('projectId')
    projectId: string,

    @Param('taskId')
    taskId: string,

    @Param('attachmentId')
    attachmentId: string,
  ) {
    return this.attachmentsService.remove(
      organizationId,
      projectId,
      taskId,
      attachmentId,
    );
  }
}
