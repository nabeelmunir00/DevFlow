import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { OrganizationRole, ROLES_KEY } from './roles.decorator.js';

import { OrganizationAccessService } from './organization-access.service.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationAccessService: OrganizationAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<OrganizationRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const clerkUserId = request.auth?.userId;
    const organizationId = request.params?.organizationId;

    if (!clerkUserId) {
      throw new ForbiddenException('Authenticated user not found');
    }

    if (!organizationId) {
      throw new ForbiddenException('Organization id is required');
    }

    const membership = await this.organizationAccessService.getMembership(
      clerkUserId,
      organizationId,
    );

    if (!requiredRoles.includes(membership.role as OrganizationRole)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
