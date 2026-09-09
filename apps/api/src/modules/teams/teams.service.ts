import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';

@Injectable()
export class TeamsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(organizationId: string, dto: CreateTeamDto) {
    const slug = this.generateSlug(dto.name);

    const existingTeam = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.organizationId, organizationId), eq(teams.slug, slug)),
    });

    if (existingTeam) {
      throw new ConflictException(
        'A team with this name already exists in this organization',
      );
    }

    const [team] = await this.databaseService.db
      .insert(schema.teams)
      .values({
        organizationId,
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
      })
      .returning();

    return {
      message: 'Team created successfully',
      team,
    };
  }

  private generateSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  async findAll(organizationId: string) {
    const teams = await this.databaseService.db.query.teams.findMany({
      where: (teams, { eq }) => eq(teams.organizationId, organizationId),
    });

    return teams;
  }
  async findOne(organizationId: string, teamId: string) {
    const team = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(organizationId: string, teamId: string, dto: UpdateTeamDto) {
    const existingTeam = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!existingTeam) {
      throw new NotFoundException('Team not found');
    }

    let slug = existingTeam.slug;

    if (dto.name) {
      slug = this.generateSlug(dto.name);

      const slugConflict = await this.databaseService.db.query.teams.findFirst({
        where: (teams, { and, eq, ne }) =>
          and(
            eq(teams.organizationId, organizationId),
            eq(teams.slug, slug),
            ne(teams.id, teamId),
          ),
      });

      if (slugConflict) {
        throw new ConflictException(
          'A team with this name already exists in this organization',
        );
      }
    }

    const [updatedTeam] = await this.databaseService.db
      .update(schema.teams)
      .set({
        ...(dto.name !== undefined && {
          name: dto.name.trim(),
          slug,
        }),

        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.teams.id, teamId),
          eq(schema.teams.organizationId, organizationId),
        ),
      )
      .returning();

    return {
      message: 'Team updated successfully',
      team: updatedTeam,
    };
  }
  async remove(organizationId: string, teamId: string) {
    const existingTeam = await this.databaseService.db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
    });

    if (!existingTeam) {
      throw new NotFoundException('Team not found');
    }

    const [deletedTeam] = await this.databaseService.db
      .delete(schema.teams)
      .where(
        and(
          eq(schema.teams.id, teamId),
          eq(schema.teams.organizationId, organizationId),
        ),
      )
      .returning();

    return {
      message: 'Team deleted successfully',
      team: deletedTeam,
    };
  }
}
