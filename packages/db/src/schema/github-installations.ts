import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";

export const githubInstallations = pgTable(
  "github_installations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    connectedById: uuid("connected_by_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    githubInstallationId: bigint("github_installation_id", {
      mode: "number",
    }).notNull(),

    githubAccountId: bigint("github_account_id", {
      mode: "number",
    }).notNull(),

    accountLogin: varchar("account_login", {
      length: 255,
    }).notNull(),

    accountType: varchar("account_type", {
      length: 50,
    }).notNull(),

    targetType: varchar("target_type", {
      length: 50,
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

    disconnectedAt: timestamp("disconnected_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex("github_installations_github_id_unique").on(
      table.githubInstallationId,
    ),

    index("github_installations_org_idx").on(table.organizationId),

    index("github_installations_account_idx").on(table.githubAccountId),
  ],
);
