import {
  bigint,
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

export const githubIssues = pgTable(
  "github_issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => githubRepositories.id, { onDelete: "cascade" }),

    githubIssueId: bigint("github_issue_id", {
      mode: "number",
    }).notNull(),

    githubNumber: integer("github_number").notNull(),

    title: varchar("title", { length: 500 }).notNull(),

    body: text("body"),

    state: varchar("state", { length: 30 }).notNull(),

    authorLogin: varchar("author_login", { length: 255 }),

    assigneeLogin: varchar("assignee_login", { length: 255 }),

    htmlUrl: text("html_url").notNull(),

    githubCreatedAt: timestamp("github_created_at", {
      withTimezone: true,
    }),

    githubUpdatedAt: timestamp("github_updated_at", {
      withTimezone: true,
    }),

    githubClosedAt: timestamp("github_closed_at", {
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
    uniqueIndex("github_issues_github_id_unique").on(table.githubIssueId),

    uniqueIndex("github_issues_repo_number_unique").on(
      table.repositoryId,
      table.githubNumber,
    ),

    index("github_issues_organization_idx").on(table.organizationId),

    index("github_issues_repository_idx").on(table.repositoryId),

    index("github_issues_state_idx").on(table.state),
  ],
);
