import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { githubPullRequests } from "./github-pull-requests.js";
import { users } from "./users.js";

export const taskGithubPullRequests = pgTable(
  "task_github_pull_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    pullRequestId: uuid("pull_request_id")
      .notNull()
      .references(() => githubPullRequests.id, {
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
    uniqueIndex("task_github_pr_task_pr_unique").on(
      table.taskId,
      table.pullRequestId,
    ),

    index("task_github_pr_task_idx").on(table.taskId),

    index("task_github_pr_pr_idx").on(table.pullRequestId),
  ],
);
