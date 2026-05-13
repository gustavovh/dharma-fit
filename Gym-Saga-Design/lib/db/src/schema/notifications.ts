import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  json,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { adminUsers } from "./auth";

// ============================================================================
// ENUMS
// ============================================================================

export const notificationTypeEnum = pgEnum("notification_type", [
  "announcement",
  "system",
  "alert",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "draft",
  "scheduled",
  "sent",
  "failed",
]);

// ============================================================================
// TABLES
// ============================================================================

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    type: notificationTypeEnum("type").notNull(),
    target_roles: json("target_roles").$type<string[]>().notNull(),
    status: notificationStatusEnum("status").notNull().default("draft"),
    sent_at: timestamp("sent_at", { withTimezone: true }),
    scheduled_at: timestamp("scheduled_at", { withTimezone: true }),
    created_by: uuid("created_by")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    typeIdx: index("notifications_type_idx").on(table.type),
    statusIdx: index("notifications_status_idx").on(table.status),
    scheduledAtIdx: index("notifications_scheduled_at_idx").on(
      table.scheduled_at
    ),
    createdByIdx: index("notifications_created_by_idx").on(table.created_by),
  })
);

