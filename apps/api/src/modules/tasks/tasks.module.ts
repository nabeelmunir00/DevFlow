import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';

import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
  imports: [UsersModule, RbacModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
