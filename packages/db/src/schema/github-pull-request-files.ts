import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { githubPullRequests } from './github-pull-requests.js';

export const githubPullRequestFiles = pgTable(
  'github_pull_request_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    pullRequestId: uuid('pull_request_id')
      .notNull()
      .references(() => githubPullRequests.id, {
        onDelete: 'cascade',
      }),

    filename: varchar('filename', {
      length: 1000,
    }).notNull(),

    status: varchar('status', {
      length: 50,
    }).notNull(),

    additions: integer('additions')
      .notNull()
      .default(0),

    deletions: integer('deletions')
      .notNull()
      .default(0),

    changes: integer('changes')
      .notNull()
      .default(0),

    patch: text('patch'),

    previousFilename: varchar('previous_filename', {
      length: 1000,
    }),

    blobUrl: text('blob_url'),

    rawUrl: text('raw_url'),

    contentsUrl: text('contents_url'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex(
      'github_pull_request_files_pr_filename_unique',
    ).on(table.pullRequestId, table.filename),

    index(
      'github_pull_request_files_pull_request_idx',
    ).on(table.pullRequestId),

    index(
      'github_pull_request_files_status_idx',
    ).on(table.status),
  ],
);

export type GithubPullRequestFile =
  typeof githubPullRequestFiles.$inferSelect;

export type NewGithubPullRequestFile =
  typeof githubPullRequestFiles.$inferInsert;
