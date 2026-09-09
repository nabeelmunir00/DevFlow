import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { UpdateOrganizationMemberRoleDto } from './dto/update-organization-member-role.dto.js';

@Injectable()
export class OrganizationMembersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(clerkUserId: string, organizationId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

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

    const memberships =
      await this.databaseService.db.query.organizationMembers.findMany({
        where: (members, { eq }) => eq(members.organizationId, organizationId),
      });

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await this.databaseService.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, membership.userId),
        });

        if (!user) {
          return null;
        }

        return {
          id: membership.id,
          role: membership.role,
          joinedAt: membership.joinedAt,

          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        };
      }),
    );

    return members.filter((member) => member !== null);
  }

  async updateRole(
    clerkUserId: string,
    organizationId: string,
    memberId: string,
    dto: UpdateOrganizationMemberRoleDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

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

    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to update member roles',
      );
    }

    const targetMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.id, memberId),
            eq(members.organizationId, organizationId),
          ),
      });

    if (!targetMembership) {
      throw new NotFoundException('Member not found');
    }

    if (targetMembership.role === 'OWNER') {
      throw new ForbiddenException('Organization owner role cannot be changed');
    }

    if (currentMembership.role === 'ADMIN' && dto.role === 'ADMIN') {
      throw new ForbiddenException(
        'Only organization owner can assign ADMIN role',
      );
    }

    const [updatedMember] = await this.databaseService.db
      .update(schema.organizationMembers)
      .set({
        role: dto.role,
      })
      .where(
        and(
          eq(schema.organizationMembers.id, memberId),
          eq(schema.organizationMembers.organizationId, organizationId),
        ),
      )
      .returning();

    if (!updatedMember) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member role updated successfully',

      member: updatedMember,
    };
  }

  async remove(clerkUserId: string, organizationId: string, memberId: string) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

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

    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to remove members',
      );
    }

    const targetMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.id, memberId),
            eq(members.organizationId, organizationId),
          ),
      });

    if (!targetMembership) {
      throw new NotFoundException('Member not found');
    }

    if (targetMembership.role === 'OWNER') {
      throw new ForbiddenException('Organization owner cannot be removed');
    }

    if (
      currentMembership.role === 'ADMIN' &&
      targetMembership.role === 'ADMIN'
    ) {
      throw new ForbiddenException('Admin cannot remove another admin');
    }

    const [removedMember] = await this.databaseService.db
      .delete(schema.organizationMembers)
      .where(
        and(
          eq(schema.organizationMembers.id, memberId),
          eq(schema.organizationMembers.organizationId, organizationId),
        ),
      )
      .returning();

    if (!removedMember) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member removed successfully',

      member: removedMember,
    };
  }
}
