import {
  bigint,
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { githubInstallations } from "./github-installations.js";
import { organizations } from "./organizations.js";
import { projects } from "./projects.js";

export const githubRepositories = pgTable(
  "github_repositories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    installationId: uuid("installation_id")
      .notNull()
      .references(() => githubInstallations.id, {
        onDelete: "cascade",
      }),

    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),

    githubRepositoryId: bigint("github_repository_id", {
      mode: "number",
    }).notNull(),

    ownerLogin: varchar("owner_login", {
      length: 255,
    }).notNull(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    fullName: varchar("full_name", {
      length: 500,
    }).notNull(),

    defaultBranch: varchar("default_branch", {
      length: 255,
    }),

    htmlUrl: varchar("html_url", {
      length: 1000,
    }),

    isPrivate: boolean("is_private").default(false).notNull(),

    isArchived: boolean("is_archived").default(false).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

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

    removedAt: timestamp("removed_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex("github_repositories_github_id_unique").on(
      table.githubRepositoryId,
    ),

    index("github_repositories_org_idx").on(table.organizationId),

    index("github_repositories_installation_idx").on(table.installationId),

    index("github_repositories_project_idx").on(table.projectId),
  ],
);
