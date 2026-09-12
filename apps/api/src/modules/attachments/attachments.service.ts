import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Multer } from 'multer';
import type { UploadedFileType } from './types/uploaded-file.type.js';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';
import { R2StorageService } from '../storage/r2-storage.service.js';
import { ActivityLogsService } from '../activity-logs/activity-logs.service.js';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly r2StorageService: R2StorageService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async upload(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    file: UploadedFileType,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const task = await this.databaseService.db.query.tasks.findFirst({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.id, taskId),
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // 10 MB max
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('Maximum file size is 10 MB');
    }

    const extension = file.originalname.includes('.')
      ? file.originalname.split('.').pop()
      : undefined;

    const uniqueFileName = extension
      ? `${randomUUID()}.${extension}`
      : randomUUID();

    const storageKey = `organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/${uniqueFileName}`;

    await this.r2StorageService.upload(storageKey, file.buffer, file.mimetype);

    try {
      const [attachment] = await this.databaseService.db
        .insert(schema.taskAttachments)
        .values({
          organizationId,
          projectId,
          taskId,
          uploadedById: currentUser.id,
          fileName: file.originalname,
          storageKey,
          mimeType: file.mimetype,
          fileSize: file.size,
        })
        .returning();

      await this.activityLogsService.create({
        organizationId,
        projectId,
        actorId: currentUser.id,
        action: 'ATTACHMENT_UPLOADED',
        entityType: 'TASK',
        entityId: taskId,
        metadata: {
          attachmentId: attachment.id,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          fileSize: attachment.fileSize,
        },
      });

      return {
        message: 'Attachment uploaded successfully',
        attachment,
      };
    } catch (error) {
      // DB insert fail ho to R2 file cleanup
      await this.r2StorageService.delete(storageKey);

      throw error;
    }
  }
  async findAll(organizationId: string, projectId: string, taskId: string) {
    const task = await this.databaseService.db.query.tasks.findFirst({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.id, taskId),
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.databaseService.db
      .select()
      .from(schema.taskAttachments)
      .where(
        and(
          eq(schema.taskAttachments.organizationId, organizationId),
          eq(schema.taskAttachments.projectId, projectId),
          eq(schema.taskAttachments.taskId, taskId),
          isNull(schema.taskAttachments.deletedAt),
        ),
      )
      .orderBy(desc(schema.taskAttachments.createdAt));
  }

  async getDownloadUrl(
    organizationId: string,
    projectId: string,
    taskId: string,
    attachmentId: string,
  ) {
    const attachment =
      await this.databaseService.db.query.taskAttachments.findFirst({
        where: (attachments, { and, eq, isNull }) =>
          and(
            eq(attachments.id, attachmentId),
            eq(attachments.organizationId, organizationId),
            eq(attachments.projectId, projectId),
            eq(attachments.taskId, taskId),
            isNull(attachments.deletedAt),
          ),
      });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const url = await this.r2StorageService.getDownloadUrl(
      attachment.storageKey,
      300,
    );

    return {
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      expiresIn: 300,
      downloadUrl: url,
    };
  }

  async remove(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    taskId: string,
    attachmentId: string,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const attachment =
      await this.databaseService.db.query.taskAttachments.findFirst({
        where: (attachments, { and, eq, isNull }) =>
          and(
            eq(attachments.id, attachmentId),
            eq(attachments.organizationId, organizationId),
            eq(attachments.projectId, projectId),
            eq(attachments.taskId, taskId),
            isNull(attachments.deletedAt),
          ),
      });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    const canDeleteAnyAttachment = [
      'OWNER',
      'ADMIN',
      'PROJECT_MANAGER',
    ].includes(membership.role);

    const isUploader = attachment.uploadedById === currentUser.id;

    if (!canDeleteAnyAttachment && !isUploader) {
      throw new ForbiddenException(
        'You can only delete attachments uploaded by you',
      );
    }

    await this.r2StorageService.delete(attachment.storageKey);

    const deletedAt = new Date();

    const [deletedAttachment] = await this.databaseService.db
      .update(schema.taskAttachments)
      .set({
        deletedAt,
      })
      .where(
        and(
          eq(schema.taskAttachments.id, attachmentId),
          eq(schema.taskAttachments.organizationId, organizationId),
          eq(schema.taskAttachments.projectId, projectId),
          eq(schema.taskAttachments.taskId, taskId),
        ),
      )
      .returning();
    await this.activityLogsService.create({
      organizationId,
      projectId,
      actorId: currentUser.id,
      action: 'ATTACHMENT_DELETED',
      entityType: 'TASK',
      entityId: taskId,
      metadata: {
        attachmentId: attachment.id,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: attachment.fileSize,
      },
    });

    return {
      message: 'Attachment deleted successfully',
      attachment: deletedAttachment,
    };
  }
}
