import {
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { projects } from "./projects.js";
import { tasks } from "./tasks.js";
import { users } from "./users.js";

export const taskAttachments = pgTable(
  "task_attachments",
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

    uploadedById: uuid("uploaded_by_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    fileName: varchar("file_name", {
      length: 255,
    }).notNull(),

    storageKey: varchar("storage_key", {
      length: 500,
    }).notNull(),

    mimeType: varchar("mime_type", {
      length: 150,
    }).notNull(),

    fileSize: integer("file_size").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),
  },

  (table) => [
    index("task_attachments_organization_idx").on(table.organizationId),

    index("task_attachments_project_idx").on(table.projectId),

    index("task_attachments_task_idx").on(table.taskId),

    index("task_attachments_uploaded_by_idx").on(table.uploadedById),
  ],
);
