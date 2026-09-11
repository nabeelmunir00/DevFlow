import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { AttachmentsController } from './attachments.controller.js';
import { AttachmentsService } from './attachments.service.js';

@Module({
  imports: [UsersModule],

  controllers: [AttachmentsController],

  providers: [AttachmentsService],

  exports: [AttachmentsService],
})
export class AttachmentsModule {}
