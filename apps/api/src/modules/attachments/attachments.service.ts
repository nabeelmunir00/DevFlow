import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Multer } from 'multer';
import type { UploadedFileType } from './types/uploaded-file.type.js';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';
import { R2StorageService } from '../storage/r2-storage.service.js';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly r2StorageService: R2StorageService,
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
}
