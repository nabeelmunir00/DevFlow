import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

const ASSIGNABLE_ROLES = [
  'ADMIN',
  'PROJECT_MANAGER',
  'DEVELOPER',
  'MEMBER',
  'VIEWER',
] as const;

export class AddOrganizationMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn(ASSIGNABLE_ROLES)
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'MEMBER' | 'VIEWER';
}
