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

export const githubPullRequestReviews = pgTable(
  "github_pull_request_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pullRequestId: uuid("pull_request_id")
      .notNull()
      .references(() => githubPullRequests.id, {
        onDelete: "cascade",
      }),

    githubReviewId: varchar("github_review_id", {
      length: 64,
    }).notNull(),

    reviewerLogin: varchar("reviewer_login", {
      length: 255,
    }),

    state: varchar("state", {
      length: 50,
    }).notNull(),

    body: text("body"),

    commitSha: varchar("commit_sha", {
      length: 64,
    }),

    htmlUrl: text("html_url"),

    submittedAt: timestamp("submitted_at", {
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
    uniqueIndex("github_pull_request_reviews_github_id_unique").on(
      table.githubReviewId,
    ),

    index("github_pull_request_reviews_pull_request_idx").on(
      table.pullRequestId,
    ),

    index("github_pull_request_reviews_state_idx").on(table.state),

    index("github_pull_request_reviews_reviewer_idx").on(table.reviewerLogin),
  ],
);

export type GithubPullRequestReview =
  typeof githubPullRequestReviews.$inferSelect;

export type NewGithubPullRequestReview =
  typeof githubPullRequestReviews.$inferInsert;
