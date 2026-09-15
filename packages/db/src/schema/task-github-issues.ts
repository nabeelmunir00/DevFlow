import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { githubIssues } from "./github-issues.js";
import { users } from "./users.js";

export const taskGithubIssues = pgTable(
  "task_github_issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    issueId: uuid("issue_id")
      .notNull()
      .references(() => githubIssues.id, {
        onDelete: "cascade",
      }),

    linkedById: uuid("linked_by_id").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("task_github_issue_task_issue_unique").on(
      table.taskId,
      table.issueId,
    ),

    index("task_github_issue_task_idx").on(table.taskId),

    index("task_github_issue_issue_idx").on(table.issueId),
  ],
);
