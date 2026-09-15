import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../../database/database.service.js';

@Injectable()
export class GithubTaskLinksService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  // =====================================================
  // COMMON VALIDATION
  // =====================================================

  private async getTask(organizationId: string, taskId: string) {
    const [task] = await this.db
      .select()
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.id, taskId),
          eq(schema.tasks.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // =====================================================
  // GET TASK GITHUB LINKS
  // =====================================================

  async getTaskGithubLinks(organizationId: string, taskId: string) {
    await this.getTask(organizationId, taskId);

    const pullRequests = await this.db
      .select({
        linkId: schema.taskGithubPullRequests.id,

        linkedAt: schema.taskGithubPullRequests.createdAt,

        linkedById: schema.taskGithubPullRequests.linkedById,

        id: schema.githubPullRequests.id,

        githubPullRequestId: schema.githubPullRequests.githubPullRequestId,

        number: schema.githubPullRequests.githubNumber,

        title: schema.githubPullRequests.title,

        state: schema.githubPullRequests.state,

        isDraft: schema.githubPullRequests.isDraft,

        merged: schema.githubPullRequests.merged,

        htmlUrl: schema.githubPullRequests.htmlUrl,

        repositoryId: schema.githubPullRequests.repositoryId,
      })
      .from(schema.taskGithubPullRequests)
      .innerJoin(
        schema.githubPullRequests,
        eq(
          schema.taskGithubPullRequests.pullRequestId,
          schema.githubPullRequests.id,
        ),
      )
      .where(eq(schema.taskGithubPullRequests.taskId, taskId));

    const issues = await this.db
      .select({
        linkId: schema.taskGithubIssues.id,

        linkedAt: schema.taskGithubIssues.createdAt,

        linkedById: schema.taskGithubIssues.linkedById,

        id: schema.githubIssues.id,

        githubIssueId: schema.githubIssues.githubIssueId,

        number: schema.githubIssues.githubNumber,

        title: schema.githubIssues.title,

        state: schema.githubIssues.state,

        htmlUrl: schema.githubIssues.htmlUrl,

        repositoryId: schema.githubIssues.repositoryId,
      })
      .from(schema.taskGithubIssues)
      .innerJoin(
        schema.githubIssues,
        eq(schema.taskGithubIssues.issueId, schema.githubIssues.id),
      )
      .where(eq(schema.taskGithubIssues.taskId, taskId));

    return {
      taskId,
      pullRequests,
      issues,
    };
  }

  // =====================================================
  // LINK PULL REQUEST
  // =====================================================

  async linkPullRequest(
    organizationId: string,
    taskId: string,
    pullRequestId: string,
    userId: string,
  ) {
    const task = await this.getTask(organizationId, taskId);

    const [pullRequest] = await this.db
      .select()
      .from(schema.githubPullRequests)
      .where(
        and(
          eq(schema.githubPullRequests.id, pullRequestId),
          eq(schema.githubPullRequests.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!pullRequest) {
      throw new NotFoundException('GitHub pull request not found');
    }

    /*
     * Prevent cross-project repository links.
     *
     * GitHub repository must either:
     * - belong to this task's project
     * - or be unlinked from a project.
     */
    const [repository] = await this.db
      .select()
      .from(schema.githubRepositories)
      .where(eq(schema.githubRepositories.id, pullRequest.repositoryId))
      .limit(1);

    if (!repository) {
      throw new NotFoundException('GitHub repository not found');
    }

    if (repository.projectId && repository.projectId !== task.projectId) {
      throw new BadRequestException(
        'Pull request repository belongs to another project',
      );
    }

    const [existing] = await this.db
      .select({
        id: schema.taskGithubPullRequests.id,
      })
      .from(schema.taskGithubPullRequests)
      .where(
        and(
          eq(schema.taskGithubPullRequests.taskId, taskId),
          eq(schema.taskGithubPullRequests.pullRequestId, pullRequestId),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException(
        'Pull request is already linked to this task',
      );
    }
    const currentUser = await this.getCurrentUser(userId);
    const [link] = await this.db
      .insert(schema.taskGithubPullRequests)
      .values({
        taskId,
        pullRequestId,
        linkedById: currentUser.id,
      })
      .returning();

    return {
      message: 'GitHub pull request linked successfully',
      link,
      pullRequest,
    };
  }

  // =====================================================
  // UNLINK PULL REQUEST
  // =====================================================

  async unlinkPullRequest(
    organizationId: string,
    taskId: string,
    pullRequestId: string,
  ) {
    await this.getTask(organizationId, taskId);

    const [deleted] = await this.db
      .delete(schema.taskGithubPullRequests)
      .where(
        and(
          eq(schema.taskGithubPullRequests.taskId, taskId),
          eq(schema.taskGithubPullRequests.pullRequestId, pullRequestId),
        ),
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException('Pull request link not found');
    }

    return {
      message: 'GitHub pull request unlinked successfully',
      link: deleted,
    };
  }

  // =====================================================
  // LINK ISSUE
  // =====================================================

  async linkIssue(
    organizationId: string,
    taskId: string,
    issueId: string,
    userId: string,
  ) {
    const task = await this.getTask(organizationId, taskId);

    const [issue] = await this.db
      .select()
      .from(schema.githubIssues)
      .where(
        and(
          eq(schema.githubIssues.id, issueId),
          eq(schema.githubIssues.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!issue) {
      throw new NotFoundException('GitHub issue not found');
    }

    const [repository] = await this.db
      .select()
      .from(schema.githubRepositories)
      .where(eq(schema.githubRepositories.id, issue.repositoryId))
      .limit(1);

    if (!repository) {
      throw new NotFoundException('GitHub repository not found');
    }

    if (repository.projectId && repository.projectId !== task.projectId) {
      throw new BadRequestException(
        'Issue repository belongs to another project',
      );
    }

    const [existing] = await this.db
      .select({
        id: schema.taskGithubIssues.id,
      })
      .from(schema.taskGithubIssues)
      .where(
        and(
          eq(schema.taskGithubIssues.taskId, taskId),
          eq(schema.taskGithubIssues.issueId, issueId),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException('Issue is already linked to this task');
    }

    const [link] = await this.db
      .insert(schema.taskGithubIssues)
      .values({
        taskId,
        issueId,
        linkedById: userId,
      })
      .returning();

    return {
      message: 'GitHub issue linked successfully',
      link,
      issue,
    };
  }

  // =====================================================
  // UNLINK ISSUE
  // =====================================================

  async unlinkIssue(organizationId: string, taskId: string, issueId: string) {
    await this.getTask(organizationId, taskId);

    const [deleted] = await this.db
      .delete(schema.taskGithubIssues)
      .where(
        and(
          eq(schema.taskGithubIssues.taskId, taskId),
          eq(schema.taskGithubIssues.issueId, issueId),
        ),
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException('Issue link not found');
    }

    return {
      message: 'GitHub issue unlinked successfully',
      link: deleted,
    };
  }
  private async getCurrentUser(clerkUserId: string) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        externalAuthId: schema.users.externalAuthId,
      })
      .from(schema.users)
      .where(eq(schema.users.externalAuthId, clerkUserId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('Current DevFlow user not found');
    }

    return user;
  }
}
