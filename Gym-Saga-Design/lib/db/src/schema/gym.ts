import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const planStatusEnum = pgEnum("plan_status", [
  "activa",
  "por_vencer",
  "vencida",
  "cancelada",
]);

export const observationTypeEnum = pgEnum("observation_type", [
  "Nota",
  "Alerta",
  "Progreso",
]);

// ============================================================================
// TABLES
// ============================================================================

// Trainers (can be admin users or separate)
export const trainers = pgTable("trainers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  avatar: varchar("avatar", { length: 10 }),
  email: varchar("email", { length: 255 }).unique(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Plans
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  duration_days: integer("duration_days").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
});

// Athletes (The main users of the mobile app)
export const athletes = pgTable("athletes", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 10 }),
  plan_id: uuid("plan_id").references(() => plans.id),
  plan_status: planStatusEnum("plan_status").notNull().default("activa"),
  plan_expiry: timestamp("plan_expiry", { withTimezone: true }),
  trainer_id: uuid("trainer_id").references(() => trainers.id),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }),
  body_fat_pct: decimal("body_fat_pct", { precision: 4, scale: 2 }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("athletes_email_idx").on(table.email),
}));

// Exercises (Library)
export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  muscle_group: varchar("muscle_group", { length: 100 }),
  description: text("description"),
  default_sets: integer("default_sets"),
  default_reps: varchar("default_reps", { length: 50 }),
  video_url: varchar("video_url", { length: 255 }),
});

// Routines
export const routines = pgTable("routines", {
  id: uuid("id").primaryKey().defaultRandom(),
  athlete_id: uuid("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  day_of_week: integer("day_of_week").notNull(), // 1-7
  trainer_id: uuid("trainer_id").references(() => trainers.id),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Exercises in Routines
export const routineExercises = pgTable("routine_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  routine_id: uuid("routine_id").notNull().references(() => routines.id, { onDelete: "cascade" }),
  exercise_id: uuid("exercise_id").notNull().references(() => exercises.id),
  name_override: varchar("name_override", { length: 255 }), // e.g. "Press banca inclinado"
  sets: integer("sets").notNull(),
  reps: varchar("reps", { length: 50 }).notNull(),
  weight_kg: varchar("weight_kg", { length: 100 }),
  rest_seconds: integer("rest_seconds"),
  notes: jsonb("notes").$type<string[]>().default([]),
  media_url: varchar("media_url", { length: 255 }),
  media_type: varchar("media_type", { length: 20 }), // image, video
  order: integer("order").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
});

// Measurements History
export const measurements = pgTable("measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  athlete_id: uuid("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }).notNull(),
  body_fat_pct: decimal("body_fat_pct", { precision: 4, scale: 2 }),
  notes: text("notes"),
});

// Attendance
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  athlete_id: uuid("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  time: varchar("time", { length: 10 }), // HH:mm
});

// Observations/Notes from trainers
export const observations = pgTable("observations", {
  id: uuid("id").primaryKey().defaultRandom(),
  athlete_id: uuid("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  trainer_id: uuid("trainer_id").notNull().references(() => trainers.id),
  type: observationTypeEnum("type").notNull().default("Nota"),
  content: text("content").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});
