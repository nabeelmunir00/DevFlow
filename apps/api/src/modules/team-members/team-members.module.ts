import { Module } from '@nestjs/common';

import { RbacModule } from '../../common/rbac/rbac.module.js';

import { TeamMembersController } from './team-members.controller.js';
import { TeamMembersService } from './team-members.service.js';

@Module({
  imports: [RbacModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
