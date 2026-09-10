import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';

import { CreateSprintDto } from './dto/create-sprint.dto.js';

@Injectable()
export class SprintsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    organizationId: string,
    projectId: string,
    dto: CreateSprintDto,
  ) {
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

    if (project.status === 'ARCHIVED') {
      throw new BadRequestException(
        'Cannot create a sprint in an archived project',
      );
    }

    const startDate = dto.startDate ? new Date(dto.startDate) : null;

    const endDate = dto.endDate ? new Date(dto.endDate) : null;

    if (startDate && endDate && endDate <= startDate) {
      throw new BadRequestException('Sprint end date must be after start date');
    }

    const status = dto.status ?? 'PLANNED';

    const [sprint] = await this.databaseService.db
      .insert(schema.sprints)
      .values({
        organizationId,
        projectId,
        name: dto.name.trim(),
        goal: dto.goal?.trim() || null,
        status,
        startDate,
        endDate,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      })
      .returning();

    return {
      message: 'Sprint created successfully',
      sprint,
    };
  }
  async findAll(organizationId: string, projectId: string) {
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

    const sprints = await this.databaseService.db.query.sprints.findMany({
      where: (sprints, { and, eq }) =>
        and(
          eq(sprints.organizationId, organizationId),
          eq(sprints.projectId, projectId),
        ),

      orderBy: (sprints, { desc }) => [desc(sprints.createdAt)],
    });

    return sprints;
  }

  async findOne(organizationId: string, projectId: string, sprintId: string) {
    const sprints = await this.databaseService.db.query.sprints.findFirst({
      where: (sprints, { and, eq }) =>
        and(
          eq(sprints.organizationId, organizationId),
          eq(sprints.projectId, projectId),
          eq(sprints.id, sprintId),
        ),
    });
    if (!sprints) {
      throw new NotFoundException('Sprint not found');
    }
    return sprints;
  }
}
