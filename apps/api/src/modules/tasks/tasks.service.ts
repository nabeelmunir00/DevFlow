import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { schema } from '@devflow/db';

import { DatabaseService } from '../../database/database.service.js';
import { UsersService } from '../users/users.service.js';

import { CreateTaskDto } from './dto/create-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    clerkUserId: string,
    organizationId: string,
    projectId: string,
    dto: CreateTaskDto,
  ) {
    const currentUser = await this.usersService.findByClerkId(clerkUserId);

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
        'Cannot create a task in an archived project',
      );
    }

    const assigneeId = dto.assigneeId;

    if (assigneeId) {
      const organizationMember =
        await this.databaseService.db.query.organizationMembers.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.organizationId, organizationId),
              eq(members.userId, assigneeId),
            ),
        });

      if (!organizationMember) {
        throw new BadRequestException(
          'Assignee must be a member of this organization',
        );
      }
    }

    const completedAt = dto.status === 'DONE' ? new Date() : null;

    const [task] = await this.databaseService.db
      .insert(schema.tasks)
      .values({
        organizationId,
        projectId,
        reporterId: currentUser.id,
        assigneeId: assigneeId ?? null,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        status: dto.status ?? 'TODO',
        priority: dto.priority ?? 'MEDIUM',
        position: dto.position ?? 0,
        estimateMinutes: dto.estimateMinutes ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        completedAt,
      })
      .returning();

    return {
      message: 'Task created successfully',
      task,
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

    const tasks = await this.databaseService.db.query.tasks.findMany({
      where: (tasks, { and, eq, isNull }) =>
        and(
          eq(tasks.organizationId, organizationId),
          eq(tasks.projectId, projectId),
          isNull(tasks.archivedAt),
        ),

      orderBy: (tasks, { asc, desc }) => [
        asc(tasks.position),
        desc(tasks.createdAt),
      ],
    });

    return tasks;
  }
}
