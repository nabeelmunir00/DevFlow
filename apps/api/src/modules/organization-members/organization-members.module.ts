import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { OrganizationMembersController } from './organization-members.controller.js';

import { OrganizationMembersService } from './organization-members.service.js';

@Module({
  imports: [UsersModule],

  controllers: [OrganizationMembersController],

  providers: [OrganizationMembersService],

  exports: [OrganizationMembersService],
})
export class OrganizationMembersModule {}
