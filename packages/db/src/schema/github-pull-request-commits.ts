import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { githubPullRequests } from "./github-pull-requests.js";

export const githubPullRequestCommits = pgTable(
  "github_pull_request_commits",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pullRequestId: uuid("pull_request_id")
      .notNull()
      .references(() => githubPullRequests.id, {
        onDelete: "cascade",
      }),

    sha: varchar("sha", {
      length: 64,
    }).notNull(),

    message: text("message").notNull(),

    authorName: varchar("author_name", {
      length: 255,
    }),

    authorEmail: varchar("author_email", {
      length: 320,
    }),

    authorLogin: varchar("author_login", {
      length: 255,
    }),

    authorDate: timestamp("author_date", {
      withTimezone: true,
    }),

    committerName: varchar("committer_name", {
      length: 255,
    }),

    committerEmail: varchar("committer_email", {
      length: 320,
    }),

    committerLogin: varchar("committer_login", {
      length: 255,
    }),

    committerDate: timestamp("committer_date", {
      withTimezone: true,
    }),

    htmlUrl: text("html_url"),

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
    uniqueIndex("github_pull_request_commits_pr_sha_unique").on(
      table.pullRequestId,
      table.sha,
    ),

    index("github_pull_request_commits_pull_request_idx").on(
      table.pullRequestId,
    ),

    index("github_pull_request_commits_sha_idx").on(table.sha),
  ],
);

export type GithubPullRequestCommit =
  typeof githubPullRequestCommits.$inferSelect;

export type NewGithubPullRequestCommit =
  typeof githubPullRequestCommits.$inferInsert;
