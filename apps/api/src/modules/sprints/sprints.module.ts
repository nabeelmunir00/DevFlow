import { Module } from '@nestjs/common';

import { RbacModule } from '../../common/rbac/rbac.module.js';

import { SprintsController } from './sprints.controller.js';
import { SprintsService } from './sprints.service.js';

@Module({
  imports: [RbacModule],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
