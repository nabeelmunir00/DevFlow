import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { projects } from "./projects.js";
import { tasks } from "./tasks.js";
import { users } from "./users.js";

export const taskSubtasks = pgTable(
  "task_subtasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    title: varchar("title", {
      length: 500,
    }).notNull(),

    isCompleted: boolean("is_completed").default(false).notNull(),

    position: integer("position").default(0).notNull(),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("task_subtasks_organization_idx").on(table.organizationId),

    index("task_subtasks_project_idx").on(table.projectId),

    index("task_subtasks_task_idx").on(table.taskId),

    index("task_subtasks_task_position_idx").on(table.taskId, table.position),
  ],
);
