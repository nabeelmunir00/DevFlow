import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';

import { CreateSprintDto } from './dto/create-sprint.dto.js';
import { UpdateSprintDto } from './dto/update-sprint.dto.js';
import { and, eq } from 'drizzle-orm';

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
  async update(
    organizationId: string,
    projectId: string,
    sprintId: string,
    dto: UpdateSprintDto,
  ) {
    const existingSprint =
      await this.databaseService.db.query.sprints.findFirst({
        where: (sprints, { and, eq }) =>
          and(
            eq(sprints.organizationId, organizationId),
            eq(sprints.projectId, projectId),
            eq(sprints.id, sprintId),
          ),
      });

    if (!existingSprint) {
      throw new NotFoundException('Sprint not found');
    }

    const startDate =
      dto.startDate !== undefined
        ? new Date(dto.startDate)
        : existingSprint.startDate;

    const endDate =
      dto.endDate !== undefined
        ? new Date(dto.endDate)
        : existingSprint.endDate;

    if (startDate && endDate && endDate <= startDate) {
      throw new BadRequestException('Sprint end date must be after start date');
    }

    let completedAt = existingSprint.completedAt;

    if (dto.status === 'COMPLETED' && existingSprint.status !== 'COMPLETED') {
      completedAt = new Date();
    }

    if (dto.status && dto.status !== 'COMPLETED') {
      completedAt = null;
    }

    const [updatedSprint] = await this.databaseService.db
      .update(schema.sprints)
      .set({
        ...(dto.name !== undefined && {
          name: dto.name.trim(),
        }),

        ...(dto.goal !== undefined && {
          goal: dto.goal.trim() || null,
        }),

        ...(dto.status !== undefined && {
          status: dto.status,
          completedAt,
        }),

        ...(dto.startDate !== undefined && {
          startDate,
        }),

        ...(dto.endDate !== undefined && {
          endDate,
        }),

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.sprints.organizationId, organizationId),
          eq(schema.sprints.projectId, projectId),
          eq(schema.sprints.id, sprintId),
        ),
      )
      .returning();

    return {
      message: 'Sprint updated successfully',
      sprint: updatedSprint,
    };
  }
  async cancel(organizationId: string, projectId: string, sprintId: string) {
    const existingSprint =
      await this.databaseService.db.query.sprints.findFirst({
        where: (sprints, { and, eq }) =>
          and(
            eq(sprints.organizationId, organizationId),
            eq(sprints.projectId, projectId),
            eq(sprints.id, sprintId),
          ),
      });

    if (!existingSprint) {
      throw new NotFoundException('Sprint not found');
    }

    if (existingSprint.status === 'CANCELLED') {
      throw new BadRequestException('Sprint is already cancelled');
    }

    if (existingSprint.status === 'COMPLETED') {
      throw new BadRequestException('Completed sprint cannot be cancelled');
    }

    const [cancelledSprint] = await this.databaseService.db
      .update(schema.sprints)
      .set({
        status: 'CANCELLED',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.sprints.organizationId, organizationId),
          eq(schema.sprints.projectId, projectId),
          eq(schema.sprints.id, sprintId),
        ),
      )
      .returning();

    return {
      message: 'Sprint cancelled successfully',
      sprint: cancelledSprint,
    };
  }
}
