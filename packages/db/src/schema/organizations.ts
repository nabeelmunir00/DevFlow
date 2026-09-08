import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const organizationPlanEnum = pgEnum("organization_plan", [
  "FREE",
  "PRO",
  "BUSINESS",
]);

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  slug: varchar("slug", {
    length: 120,
  })
    .notNull()
    .unique(),

  logoUrl: varchar("logo_url", {
    length: 500,
  }),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "restrict",
    }),

  plan: organizationPlanEnum("plan").default("FREE").notNull(),

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
});
