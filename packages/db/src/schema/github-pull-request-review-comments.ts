import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { githubPullRequests } from "./github-pull-requests.js";

export const githubPullRequestReviewComments = pgTable(
  "github_pull_request_review_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pullRequestId: uuid("pull_request_id")
      .notNull()
      .references(() => githubPullRequests.id, {
        onDelete: "cascade",
      }),

    githubCommentId: varchar("github_comment_id", {
      length: 64,
    }).notNull(),

    githubReviewId: varchar("github_review_id", {
      length: 64,
    }),

    authorLogin: varchar("author_login", {
      length: 255,
    }),

    body: text("body").notNull(),

    path: text("path").notNull(),

    line: integer("line"),

    originalLine: integer("original_line"),

    startLine: integer("start_line"),

    originalStartLine: integer("original_start_line"),

    side: varchar("side", {
      length: 20,
    }),

    startSide: varchar("start_side", {
      length: 20,
    }),

    commitSha: varchar("commit_sha", {
      length: 64,
    }),

    originalCommitSha: varchar("original_commit_sha", {
      length: 64,
    }),

    diffHunk: text("diff_hunk"),

    htmlUrl: text("html_url"),

    githubCreatedAt: timestamp("github_created_at", {
      withTimezone: true,
    }),

    githubUpdatedAt: timestamp("github_updated_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("github_pr_review_comments_github_id_unique").on(
      table.githubCommentId,
    ),

    index("github_pr_review_comments_pull_request_idx").on(table.pullRequestId),

    index("github_pr_review_comments_review_idx").on(table.githubReviewId),

    index("github_pr_review_comments_author_idx").on(table.authorLogin),

    index("github_pr_review_comments_path_idx").on(table.path),
  ],
);

export type GithubPullRequestReviewComment =
  typeof githubPullRequestReviewComments.$inferSelect;

export type NewGithubPullRequestReviewComment =
  typeof githubPullRequestReviewComments.$inferInsert;
