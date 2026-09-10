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
}
