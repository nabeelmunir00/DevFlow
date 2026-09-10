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
import { UpdateProjectDto } from './dto/update-project.dto.js';

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
  async findOne(organizationId: string, projectId: string) {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, organizationId),
        ),
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
  async update(
    organizationId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const existingProject =
      await this.databaseService.db.query.projects.findFirst({
        where: (projects, { and, eq }) =>
          and(
            eq(projects.id, projectId),
            eq(projects.organizationId, organizationId),
          ),
      });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    let normalizedKey = existingProject.key;

    if (dto.key) {
      normalizedKey = dto.key.trim().toUpperCase();

      const conflictingProject =
        await this.databaseService.db.query.projects.findFirst({
          where: (projects, { and, eq, ne }) =>
            and(
              eq(projects.organizationId, organizationId),
              eq(projects.key, normalizedKey),
              ne(projects.id, projectId),
            ),
        });

      if (conflictingProject) {
        throw new ConflictException(
          'A project with this key already exists in this organization',
        );
      }
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

    const [updatedProject] = await this.databaseService.db
      .update(schema.projects)
      .set({
        ...(dto.name !== undefined && {
          name: dto.name.trim(),
        }),
        ...(dto.key !== undefined && {
          key: normalizedKey,
        }),
        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),
        ...(dto.teamId !== undefined && {
          teamId: dto.teamId,
        }),
        ...(dto.status !== undefined && {
          status: dto.status,
        }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.projects.id, projectId),
          eq(schema.projects.organizationId, organizationId),
        ),
      )
      .returning();

    return {
      message: 'Project updated successfully',
      project: updatedProject,
    };
  }
}
