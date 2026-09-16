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

  // GitHub PR statistics
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  commitsCount?: number;
  commentsCount?: number;
  reviewCommentsCount?: number;

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

type GithubPullRequestFileInput = {
  filename: string;
  status: string;

  additions: number;
  deletions: number;
  changes: number;

  patch: string | null;

  previousFilename: string | null;

  blobUrl: string | null;
  rawUrl: string | null;
  contentsUrl: string | null;
};

@Injectable()
export class GithubEntityPersistenceService {
  private readonly logger = new Logger(GithubEntityPersistenceService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // =====================================================
  // HELPERS
  // =====================================================

  private toDate(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // =====================================================
  // PULL REQUEST
  // =====================================================

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

        // ---------------------------------------------
        // PR statistics
        // ---------------------------------------------

        additions: input.additions ?? 0,

        deletions: input.deletions ?? 0,

        changedFiles: input.changedFiles ?? 0,

        commitsCount: input.commitsCount ?? 0,

        commentsCount: input.commentsCount ?? 0,

        reviewCommentsCount: input.reviewCommentsCount ?? 0,

        // ---------------------------------------------
        // GitHub timestamps
        // ---------------------------------------------

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

          // -----------------------------------------
          // PR statistics
          // -----------------------------------------

          additions: input.additions ?? 0,

          deletions: input.deletions ?? 0,

          changedFiles: input.changedFiles ?? 0,

          commitsCount: input.commitsCount ?? 0,

          commentsCount: input.commentsCount ?? 0,

          reviewCommentsCount: input.reviewCommentsCount ?? 0,

          // -----------------------------------------
          // GitHub timestamps
          // -----------------------------------------

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

  // =====================================================
  // PULL REQUEST FILES
  // =====================================================

  async replacePullRequestFiles(
    pullRequestId: string,
    files: GithubPullRequestFileInput[],
  ) {
    const db = this.databaseService.db;

    /*
     * PR files represent the current GitHub diff snapshot.
     *
     * A synchronize event can:
     *
     * - add files
     * - remove files
     * - rename files
     * - change patches
     *
     * Therefore we replace the complete file snapshot
     * instead of individually upserting files.
     *
     * Delete + insert happen inside the same transaction.
     * If insertion fails, the deletion is rolled back.
     */
    const savedFiles = await db.transaction(async (tx) => {
      // ---------------------------------------------
      // Remove previous snapshot
      // ---------------------------------------------

      await tx.delete(schema.githubPullRequestFiles).where(
        eq(
          schema.githubPullRequestFiles.pullRequestId,

          pullRequestId,
        ),
      );

      // ---------------------------------------------
      // PR currently has no changed files
      // ---------------------------------------------

      if (files.length === 0) {
        return [];
      }

      const now = new Date();

      // ---------------------------------------------
      // Insert latest snapshot
      // ---------------------------------------------

      const insertedFiles = await tx
        .insert(schema.githubPullRequestFiles)
        .values(
          files.map((file) => ({
            pullRequestId,

            filename: file.filename,

            status: file.status,

            additions: file.additions,

            deletions: file.deletions,

            changes: file.changes,

            patch: file.patch,

            previousFilename: file.previousFilename,

            blobUrl: file.blobUrl,

            rawUrl: file.rawUrl,

            contentsUrl: file.contentsUrl,

            updatedAt: now,
          })),
        )
        .returning();

      return insertedFiles;
    });

    this.logger.log(
      `GitHub PR files persisted: pullRequest=${pullRequestId} files=${savedFiles.length}`,
    );

    return savedFiles;
  }

  // =====================================================
  // ISSUE
  // =====================================================

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
