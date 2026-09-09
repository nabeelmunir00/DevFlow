// src/modules/organization-members/dto/update-organization-member-role.dto.ts

import { IsIn } from 'class-validator';

const MEMBER_ROLES = [
  'ADMIN',
  'PROJECT_MANAGER',
  'DEVELOPER',
  'MEMBER',
  'VIEWER',
] as const;

export class UpdateOrganizationMemberRoleDto {
  @IsIn(MEMBER_ROLES)
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'MEMBER' | 'VIEWER';
}
