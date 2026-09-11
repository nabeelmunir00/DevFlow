import { Global, Module } from '@nestjs/common';

import { EmailModule } from '../modules/email/email.module.js';

import { QueueService } from './queue.service.js';
import { QueueWorker } from './queue.worker.js';
import { EmailQueueService } from './email-queue.service.js';
import { EmailWorker } from './email.worker.js';

@Global()
@Module({
  imports: [EmailModule],

  providers: [QueueService, QueueWorker, EmailQueueService, EmailWorker],

  exports: [QueueService, EmailQueueService],
})
export class QueueModule {}
