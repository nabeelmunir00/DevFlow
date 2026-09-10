import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { CreateProjectDto } from './dto/create-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    dto: CreateProjectDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

    const normalizedKey = dto.key.trim().toUpperCase();

    const existingProject =
      await this.databaseService.db.query.projects.findFirst({
        where: (projects, { and, eq }) =>
          and(
            eq(projects.organizationId, organizationId),
            eq(projects.key, normalizedKey),
          ),
      });

    if (existingProject) {
      throw new ConflictException(
        'A project with this key already exists in this organization',
      );
    }

    const teamId = dto.teamId;

    if (teamId) {
      const team = await this.databaseService.db.query.teams.findFirst({
        where: (teams, { and, eq }) =>
          and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)),
      });

      if (!team) {
        throw new NotFoundException('Team not found in this organization');
      }
    }

    const [project] = await this.databaseService.db
      .insert(schema.projects)
      .values({
        organizationId,
        teamId: dto.teamId ?? null,
        ownerId: currentUser.id,
        name: dto.name.trim(),
        key: normalizedKey,
        description: dto.description?.trim() || null,
        status: dto.status ?? 'PLANNING',
      })
      .returning();

    return {
      message: 'Project created successfully',
      project,
    };
  }

  async findAll(organizationId: string) {
    const projects = await this.databaseService.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.organizationId, organizationId),

      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return projects;
  }
}
