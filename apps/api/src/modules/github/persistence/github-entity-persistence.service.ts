import { Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { schema } from '@devflow/db';

import { DatabaseService } from '../../../database/database.service.js';

type GithubPullRequestInput = {
  organizationId: string;
  repositoryId: string;
  githubPullRequestId: number;
  githubNumber: number;
  title: string;
  body?: string | null;
  state: string;
  isDraft?: boolean;
  authorLogin?: string | null;
  headRef?: string | null;
  baseRef?: string | null;
  htmlUrl: string;
  merged?: boolean;
  githubCreatedAt?: string | null;
  githubUpdatedAt?: string | null;
  githubClosedAt?: string | null;
  githubMergedAt?: string | null;
};

type GithubIssueInput = {
  organizationId: string;
  repositoryId: string;
  githubIssueId: number;
  githubNumber: number;
  title: string;
  body?: string | null;
  state: string;
  authorLogin?: string | null;
  assigneeLogin?: string | null;
  htmlUrl: string;
  githubCreatedAt?: string | null;
  githubUpdatedAt?: string | null;
  githubClosedAt?: string | null;
};

@Injectable()
export class GithubEntityPersistenceService {
  private readonly logger = new Logger(GithubEntityPersistenceService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  private toDate(value?: string | null): Date | null {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  async upsertPullRequest(input: GithubPullRequestInput) {
    const now = new Date();

    const [pullRequest] = await this.databaseService.db
      .insert(schema.githubPullRequests)
      .values({
        organizationId: input.organizationId,
        repositoryId: input.repositoryId,
        githubPullRequestId: input.githubPullRequestId,
        githubNumber: input.githubNumber,
        title: input.title,
        body: input.body ?? null,
        state: input.state,
        isDraft: input.isDraft ?? false,
        authorLogin: input.authorLogin ?? null,
        headRef: input.headRef ?? null,
        baseRef: input.baseRef ?? null,
        htmlUrl: input.htmlUrl,
        merged: input.merged ?? false,
        githubCreatedAt: this.toDate(input.githubCreatedAt),
        githubUpdatedAt: this.toDate(input.githubUpdatedAt),
        githubClosedAt: this.toDate(input.githubClosedAt),
        githubMergedAt: this.toDate(input.githubMergedAt),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.githubPullRequests.githubPullRequestId,
        set: {
          organizationId: input.organizationId,
          repositoryId: input.repositoryId,
          githubNumber: input.githubNumber,
          title: input.title,
          body: input.body ?? null,
          state: input.state,
          isDraft: input.isDraft ?? false,
          authorLogin: input.authorLogin ?? null,
          headRef: input.headRef ?? null,
          baseRef: input.baseRef ?? null,
          htmlUrl: input.htmlUrl,
          merged: input.merged ?? false,
          githubUpdatedAt: this.toDate(input.githubUpdatedAt),
          githubClosedAt: this.toDate(input.githubClosedAt),
          githubMergedAt: this.toDate(input.githubMergedAt),
          updatedAt: now,
        },
      })
      .returning();

    this.logger.log(
      `GitHub PR persisted: repo=${input.repositoryId} #${input.githubNumber}`,
    );

    return pullRequest;
  }

  async upsertIssue(input: GithubIssueInput) {
    const now = new Date();

    const [issue] = await this.databaseService.db
      .insert(schema.githubIssues)
      .values({
        organizationId: input.organizationId,
        repositoryId: input.repositoryId,
        githubIssueId: input.githubIssueId,
        githubNumber: input.githubNumber,
        title: input.title,
        body: input.body ?? null,
        state: input.state,
        authorLogin: input.authorLogin ?? null,
        assigneeLogin: input.assigneeLogin ?? null,
        htmlUrl: input.htmlUrl,
        githubCreatedAt: this.toDate(input.githubCreatedAt),
        githubUpdatedAt: this.toDate(input.githubUpdatedAt),
        githubClosedAt: this.toDate(input.githubClosedAt),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.githubIssues.githubIssueId,
        set: {
          organizationId: input.organizationId,
          repositoryId: input.repositoryId,
          githubNumber: input.githubNumber,
          title: input.title,
          body: input.body ?? null,
          state: input.state,
          authorLogin: input.authorLogin ?? null,
          assigneeLogin: input.assigneeLogin ?? null,
          htmlUrl: input.htmlUrl,
          githubUpdatedAt: this.toDate(input.githubUpdatedAt),
          githubClosedAt: this.toDate(input.githubClosedAt),
          updatedAt: now,
        },
      })
      .returning();

    this.logger.log(
      `GitHub issue persisted: repo=${input.repositoryId} #${input.githubNumber}`,
    );

    return issue;
  }
}
