import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { schema } from '@devflow/db';
import { eq } from 'drizzle-orm';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

import { CreateOrganizationDto } from './dto/create-organization.dto.js';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(clerkUserId: string, dto: CreateOrganizationDto) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    const existing =
      await this.databaseService.db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.slug, dto.slug!),
      });

    if (existing) {
      throw new ConflictException('Organization slug already exists');
    }

    return this.databaseService.db.transaction(async (tx) => {
      const [organization] = await tx
        .insert(schema.organizations)
        .values({
          name: dto.name,
          slug: dto.slug,
          ownerId: user.id,
          plan: 'FREE',
        })
        .returning();

      await tx.insert(schema.organizationMembers).values({
        organizationId: organization.id,
        userId: user.id,
        role: 'OWNER',
      });

      return organization;
    });
  }

  async findAllForCurrentUser(clerkUserId: string) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    const memberships =
      await this.databaseService.db.query.organizationMembers.findMany({
        where: (members, { eq }) => eq(members.userId, user.id),
      });

    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const organization =
          await this.databaseService.db.query.organizations.findFirst({
            where: (organizations, { eq }) =>
              eq(organizations.id, membership.organizationId),
          });

        if (!organization) {
          return null;
        }

        return {
          ...organization,
          role: membership.role,
          joinedAt: membership.joinedAt,
        };
      }),
    );

    return organizations.filter((organization) => organization !== null);
  }
  async findOneForCurrentUser(clerkUserId: string, organizationId: string) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, user.id),
          ),
      });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    const organization =
      await this.databaseService.db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, organizationId),
      });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return {
      ...organization,
      role: membership.role,
      joinedAt: membership.joinedAt,
    };
  }
  async update(
    clerkUserId: string,
    organizationId: string,
    dto: UpdateOrganizationDto,
  ) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, user.id),
          ),
      });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to update this organization',
      );
    }

    if (dto.slug) {
      const existing =
        await this.databaseService.db.query.organizations.findFirst({
          where: (organizations, { eq }) => eq(organizations.slug, dto.slug!),
        });

      if (existing && existing.id !== organizationId) {
        throw new ConflictException('Organization slug already exists');
      }
    }

    const [organization] = await this.databaseService.db
      .update(schema.organizations)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
  async remove(clerkUserId: string, organizationId: string) {
    const user = await this.usersService.findByClerkId(clerkUserId);

    const membership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, user.id),
          ),
      });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role !== 'OWNER') {
      throw new ForbiddenException(
        'Only the organization owner can delete this organization',
      );
    }

    const [organization] = await this.databaseService.db
      .delete(schema.organizations)
      .where(eq(schema.organizations.id, organizationId))
      .returning();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return {
      success: true,
      message: 'Organization deleted successfully',
      organization,
    };
  }
}
