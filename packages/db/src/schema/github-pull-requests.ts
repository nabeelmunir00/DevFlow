import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { githubRepositories } from "./github-repositories.js";

export const githubPullRequests = pgTable(
  "github_pull_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => githubRepositories.id, { onDelete: "cascade" }),

    githubPullRequestId: bigint("github_pull_request_id", {
      mode: "number",
    }).notNull(),

    githubNumber: integer("github_number").notNull(),

    title: varchar("title", { length: 500 }).notNull(),

    body: text("body"),

    state: varchar("state", { length: 30 }).notNull(),

    isDraft: boolean("is_draft").notNull().default(false),

    authorLogin: varchar("author_login", { length: 255 }),

    headRef: varchar("head_ref", { length: 255 }),

    baseRef: varchar("base_ref", { length: 255 }),

    htmlUrl: text("html_url").notNull(),

    merged: boolean("merged").notNull().default(false),

    // GitHub PR statistics
    additions: integer("additions").notNull().default(0),

    deletions: integer("deletions").notNull().default(0),

    changedFiles: integer("changed_files").notNull().default(0),

    commitsCount: integer("commits_count").notNull().default(0),

    commentsCount: integer("comments_count").notNull().default(0),

    reviewCommentsCount: integer("review_comments_count").notNull().default(0),

    githubCreatedAt: timestamp("github_created_at", {
      withTimezone: true,
    }),

    githubUpdatedAt: timestamp("github_updated_at", {
      withTimezone: true,
    }),

    githubClosedAt: timestamp("github_closed_at", {
      withTimezone: true,
    }),

    githubMergedAt: timestamp("github_merged_at", {
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
    uniqueIndex("github_pull_requests_github_id_unique").on(
      table.githubPullRequestId,
    ),

    uniqueIndex("github_pull_requests_repo_number_unique").on(
      table.repositoryId,
      table.githubNumber,
    ),

    index("github_pull_requests_organization_idx").on(table.organizationId),

    index("github_pull_requests_repository_idx").on(table.repositoryId),

    index("github_pull_requests_state_idx").on(table.state),
  ],
);
