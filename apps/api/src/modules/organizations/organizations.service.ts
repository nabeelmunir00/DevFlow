import { ConflictException, Injectable } from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

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
        where: (organizations, { eq }) => eq(organizations.slug, dto.slug),
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
}
