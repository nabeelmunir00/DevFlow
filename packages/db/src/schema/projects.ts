import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";
import { teams } from "./teams.js";

export const projectStatusEnum = pgEnum("project_status", [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),

    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    key: varchar("key", {
      length: 20,
    }).notNull(),

    description: varchar("description", {
      length: 1000,
    }),

    status: projectStatusEnum("status").default("PLANNING").notNull(),

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

    archivedAt: timestamp("archived_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex("projects_org_key_unique").on(table.organizationId, table.key),
  ],
);
