import { ConflictException, Injectable } from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { CreateTeamDto } from './dto/create-team.dto.js';

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
}
