import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { AttachmentsController } from './attachments.controller.js';
import { AttachmentsService } from './attachments.service.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';

@Module({
  imports: [UsersModule, RbacModule],

  controllers: [AttachmentsController],

  providers: [AttachmentsService],

  exports: [AttachmentsService],
})
export class AttachmentsModule {}
