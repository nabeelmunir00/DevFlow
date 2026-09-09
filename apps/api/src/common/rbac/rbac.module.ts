import { Module } from '@nestjs/common';

import { UsersModule } from '../../modules/users/users.module.js';
import { OrganizationAccessService } from './organization-access.service.js';
import { RolesGuard } from './roles.guard.js';

@Module({
  imports: [UsersModule],
  providers: [OrganizationAccessService, RolesGuard],
  exports: [OrganizationAccessService, RolesGuard],
})
export class RbacModule {}
