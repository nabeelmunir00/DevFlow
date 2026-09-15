import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const githubWebhookDeliveries = pgTable(
  "github_webhook_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    deliveryId: varchar("delivery_id", {
      length: 255,
    })
      .notNull()
      .unique(),

    event: varchar("event", {
      length: 100,
    }).notNull(),

    action: varchar("action", {
      length: 100,
    }),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("PROCESSING"),

    processedAt: timestamp("processed_at", {
      withTimezone: true,
    }),

    failedAt: timestamp("failed_at", {
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
    index("github_webhook_deliveries_event_idx").on(table.event),

    index("github_webhook_deliveries_status_idx").on(table.status),

    index("github_webhook_deliveries_created_at_idx").on(table.createdAt),
  ],
);
