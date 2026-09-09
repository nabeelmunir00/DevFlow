import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type OrganizationRole =
  'OWNER' | 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'MEMBER' | 'VIEWER';

export const Roles = (...roles: OrganizationRole[]) =>
  SetMetadata(ROLES_KEY, roles);
