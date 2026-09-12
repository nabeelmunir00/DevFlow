import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { tasks } from "./tasks.js";
import { labels } from "./labels.js";

export const taskLabels = pgTable(
  "task_labels",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, {
        onDelete: "cascade",
      }),

    labelId: uuid("label_id")
      .notNull()
      .references(() => labels.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.taskId, table.labelId],
    }),

    index("task_labels_task_idx").on(table.taskId),

    index("task_labels_label_idx").on(table.labelId),
  ],
);
