import { Global, Module } from '@nestjs/common';

import { QueueService } from './queue.service.js';
import { QueueWorker } from './queue.worker.js';

@Global()
@Module({
  providers: [QueueService, QueueWorker],
  exports: [QueueService],
})
export class QueueModule {}
