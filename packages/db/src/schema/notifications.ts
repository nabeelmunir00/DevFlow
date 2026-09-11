import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";

export const notificationTypeEnum = pgEnum("notification_type", [
  "TASK_ASSIGNED",
  "TASK_STATUS_CHANGED",
  "TASK_COMMENTED",
  "ORGANIZATION_INVITATION",
  "PROJECT_UPDATED",
  "SPRINT_UPDATED",
  "GENERAL",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    type: notificationTypeEnum("type").notNull(),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    message: varchar("message", {
      length: 1000,
    }).notNull(),

    entityType: varchar("entity_type", {
      length: 50,
    }),

    entityId: uuid("entity_id"),

    metadata: jsonb("metadata"),

    isRead: boolean("is_read").default(false).notNull(),

    readAt: timestamp("read_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("notifications_user_idx").on(table.userId),

    index("notifications_organization_idx").on(table.organizationId),

    index("notifications_user_read_idx").on(table.userId, table.isRead),

    index("notifications_created_at_idx").on(table.createdAt),
  ],
);
