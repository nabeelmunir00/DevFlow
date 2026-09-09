import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

const INVITABLE_ROLES = [
  'ADMIN',
  'PROJECT_MANAGER',
  'DEVELOPER',
  'MEMBER',
  'VIEWER',
] as const;

export class CreateOrganizationInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn(INVITABLE_ROLES)
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'MEMBER' | 'VIEWER';
}
