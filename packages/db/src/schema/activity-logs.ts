import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";
import { projects } from "./projects.js";

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),

    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),

    action: varchar("action", {
      length: 100,
    }).notNull(),

    entityType: varchar("entity_type", {
      length: 50,
    }).notNull(),

    entityId: uuid("entity_id"),

    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("activity_logs_organization_idx").on(table.organizationId),

    index("activity_logs_project_idx").on(table.projectId),

    index("activity_logs_actor_idx").on(table.actorId),

    index("activity_logs_entity_idx").on(table.entityType, table.entityId),

    index("activity_logs_created_at_idx").on(table.createdAt),
  ],
);
