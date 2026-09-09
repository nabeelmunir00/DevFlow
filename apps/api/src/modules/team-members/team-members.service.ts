import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';

import { AddTeamMemberDto } from './dto/add-team-member.dto.js';

@Injectable()
export class TeamMembersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addMember(
    organizationId: string,
    teamId: string,
    dto: AddTeamMemberDto,
  ) {
    // 1. Make sure team belongs to this organization
    const team = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 2. Make sure user belongs to this organization
    const organizationMembership =
      await this.databaseService.db.query.organizationMembers.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, dto.userId),
          ),
      });

    if (!organizationMembership) {
      throw new NotFoundException('User is not a member of this organization');
    }

    // 3. Check duplicate team membership
    const existingTeamMember =
      await this.databaseService.db.query.teamMembers.findFirst({
        where: (members, { and, eq }) =>
          and(eq(members.teamId, teamId), eq(members.userId, dto.userId)),
      });

    if (existingTeamMember) {
      throw new ConflictException('User is already a member of this team');
    }

    // 4. Add user to team
    const [teamMember] = await this.databaseService.db
      .insert(schema.teamMembers)
      .values({
        teamId,
        userId: dto.userId,
      })
      .returning();

    return {
      message: 'Team member added successfully',
      member: teamMember,
    };
  }
  async findAll(organizationId: string, teamId: string) {
    const team = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const memberships =
      await this.databaseService.db.query.teamMembers.findMany({
        where: (members, { eq }) => eq(members.teamId, teamId),
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

  async remove(organizationId: string, teamId: string, memberId: string) {
    // 1. Make sure team belongs to organization
    const team = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 2. Find team membership
    const teamMembership =
      await this.databaseService.db.query.teamMembers.findFirst({
        where: (members, { and, eq }) =>
          and(eq(members.id, memberId), eq(members.teamId, teamId)),
      });

    if (!teamMembership) {
      throw new NotFoundException('Team member not found');
    }

    // 3. Delete membership
    const [removedMember] = await this.databaseService.db
      .delete(schema.teamMembers)
      .where(
        and(
          eq(schema.teamMembers.id, memberId),
          eq(schema.teamMembers.teamId, teamId),
        ),
      )
      .returning();

    return {
      message: 'Team member removed successfully',
      member: removedMember,
    };
  }
}
