import { z } from "zod";

export const AthleteStatusEnum = z.enum(["activa", "por_vencer", "vencida", "cancelada"]);
export type AthleteStatus = z.infer<typeof AthleteStatusEnum>;

export const AthleteSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  plan_status: AthleteStatusEnum,
  plan_expiry: z.date().nullable().optional(),
  weight_kg: z.string().nullable().optional(),
  body_fat_pct: z.string().nullable().optional(),
  created_at: z.date(),
});

export type Athlete = z.infer<typeof AthleteSchema>;

export const MeasurementSchema = z.object({
  id: z.string().uuid(),
  athlete_id: z.string().uuid(),
  date: z.date(),
  weight_kg: z.string(),
  body_fat_pct: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type Measurement = z.infer<typeof MeasurementSchema>;

export const ExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  muscle_group: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  video_url: z.string().url().nullable().optional(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export const RoutineExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  muscle_group: z.string().nullable().optional(),
  sets: z.number(),
  reps: z.string(),
  weight_kg: z.string().nullable().optional(),
  completed: z.boolean(),
  order: z.number(),
});

export type RoutineExercise = z.infer<typeof RoutineExerciseSchema>;

export const RoutineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  day_of_week: z.number(),
  exercises: z.array(RoutineExerciseSchema),
});

export type Routine = z.infer<typeof RoutineSchema>;

export const CreateAthleteSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  plan_id: z.string().uuid().optional(),
  trainer_id: z.string().uuid().optional(),
});

export type CreateAthlete = z.infer<typeof CreateAthleteSchema>;

export const CreateMeasurementSchema = z.object({
  weight_kg: z.number(),
  body_fat_pct: z.number().optional(),
  notes: z.string().optional(),
});

export type CreateMeasurement = z.infer<typeof CreateMeasurementSchema>;
