import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';
import { RbacModule } from '../../common/rbac/rbac.module.js';

import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [UsersModule, RbacModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
