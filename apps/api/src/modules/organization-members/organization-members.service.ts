import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { AddOrganizationMemberDto } from './dto/add-organization-member.dto.js';

@Injectable()
export class OrganizationMembersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async addMember(
    clerkUserId: string,
    organizationId: string,
    dto: AddOrganizationMemberDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    // Check current user's organization membership
    const currentMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, currentUser.id),
          ),
      });

    if (!currentMembership) {
      throw new NotFoundException('Organization not found');
    }

    // Only OWNER / ADMIN can add members
    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'ADMIN'
    ) {
      throw new ForbiddenException('You do not have permission to add members');
    }

    const targetUser = await this.usersService.findByEmail(dto.email);

    const existingMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, targetUser.id),
          ),
      });

    if (existingMembership) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const [membership] = await this.databaseService.db
      .insert(schema.organizationMembers)
      .values({
        organizationId,
        userId: targetUser.id,
        role: dto.role,
      })
      .returning();

    return {
      ...membership,

      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        avatarUrl: targetUser.avatarUrl,
      },
    };
  }
}
