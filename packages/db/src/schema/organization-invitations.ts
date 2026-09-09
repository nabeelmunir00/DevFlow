import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { organizationRoleEnum } from "./organization-members.js";
import { users } from "./users.js";

export const organizationInvitationStatusEnum = pgEnum(
  "organization_invitation_status",
  ["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"],
);

export const organizationInvitations = pgTable(
  "organization_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    email: varchar("email", {
      length: 320,
    }).notNull(),

    role: organizationRoleEnum("role").default("MEMBER").notNull(),

    tokenHash: varchar("token_hash", {
      length: 64,
    })
      .notNull()
      .unique(),

    status: organizationInvitationStatusEnum("status")
      .default("PENDING")
      .notNull(),

    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    acceptedAt: timestamp("accepted_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("organization_invitations_org_idx").on(table.organizationId),

    index("organization_invitations_email_idx").on(table.email),

    uniqueIndex("organization_invitations_pending_org_email_unique").on(
      table.organizationId,
      table.email,
    ),
  ],
);
