import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { projects } from "./projects.js";
import { users } from "./users.js";

export const labels = pgTable(
  "labels",
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

    createdById: uuid("created_by_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    color: varchar("color", {
      length: 20,
    }).notNull(),

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
    index("labels_organization_idx").on(table.organizationId),

    index("labels_project_idx").on(table.projectId),

    index("labels_project_name_idx").on(table.projectId, table.name),
  ],
);
