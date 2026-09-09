import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../../modules/users/users.service.js';

@Injectable()
export class OrganizationAccessService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async getMembership(clerkUserId: string, organizationId: string) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (organizationMembers, { and, eq }) =>
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.userId, user.id),
          ),
      });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    return membership;
  }
}
