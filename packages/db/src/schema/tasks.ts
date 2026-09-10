import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { projects } from "./projects.js";
import { users } from "./users.js";
import { sprints } from "./sprints.js";

export const taskStatusEnum = pgEnum("task_status", [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const tasks = pgTable(
  "tasks",
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
    sprintId: uuid("sprint_id").references(() => sprints.id, {
      onDelete: "set null",
    }),

    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    assigneeId: uuid("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    description: text("description"),

    status: taskStatusEnum("status").default("TODO").notNull(),

    priority: taskPriorityEnum("priority").default("MEDIUM").notNull(),

    position: integer("position").default(0).notNull(),

    estimateMinutes: integer("estimate_minutes"),

    dueDate: timestamp("due_date", {
      withTimezone: true,
    }),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    archivedAt: timestamp("archived_at", {
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
    index("tasks_organization_idx").on(table.organizationId),

    index("tasks_project_idx").on(table.projectId),

    index("tasks_assignee_idx").on(table.assigneeId),

    index("tasks_status_idx").on(table.status),

    index("tasks_project_status_idx").on(table.projectId, table.status),
    index("tasks_sprint_idx").on(table.sprintId),
  ],
);
