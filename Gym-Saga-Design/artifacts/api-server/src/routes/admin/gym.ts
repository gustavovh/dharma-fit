import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { athletes, plans, trainers, measurements, routines, routineExercises, exercises } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { authenticateAdmin, requirePermission } from "../../middlewares/auth.js";
import bcrypt from "bcrypt";

export async function createAdminGymRoutes(router: Router) {
  // ATHLETES
  // List all athletes
  router.get(
    "/admin/gym/athletes",
    authenticateAdmin,
    requirePermission("view_users"), // Using existing permission for now
    async (req: Request, res: Response) => {
      try {
        const data = await db
          .select({
            id: athletes.id,
            email: athletes.email,
            name: athletes.name,
            plan_status: athletes.plan_status,
            plan_expiry: athletes.plan_expiry,
            weight_kg: athletes.weight_kg,
            body_fat_pct: athletes.body_fat_pct,
            created_at: athletes.created_at,
          })
          .from(athletes)
          .orderBy(desc(athletes.created_at));

        res.json({
          success: true,
          data,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Failed to fetch athletes:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  // Get single athlete details
  router.get(
    "/admin/gym/athletes/:id",
    authenticateAdmin,
    requirePermission("view_users"),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const [athlete] = await db
          .select()
          .from(athletes)
          .where(eq(athletes.id, id));

        if (!athlete) {
          return res.status(404).json({ success: false, error: "Athlete not found" });
        }

        // Get latest measurements
        const recentMeasurements = await db
          .select()
          .from(measurements)
          .where(eq(measurements.athlete_id, id))
          .orderBy(desc(measurements.date))
          .limit(10);

        res.json({
          success: true,
          data: {
            ...athlete,
            measurements: recentMeasurements,
          },
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Failed to fetch athlete details:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  // Create new athlete
  router.post(
    "/admin/gym/athletes",
    authenticateAdmin,
    requirePermission("create_user"),
    async (req: Request, res: Response) => {
      try {
        const { email, password, name, plan_id, trainer_id } = req.body;

        if (!email || !password || !name) {
          return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newAthlete] = await db
          .insert(athletes)
          .values({
            email,
            password_hash: hashedPassword,
            name,
            plan_id,
            trainer_id,
            plan_status: "activa",
          })
          .returning();

        res.status(201).json({
          success: true,
          data: newAthlete,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Failed to create athlete:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  // MEASUREMENTS
  // Add measurement for athlete
  router.post(
    "/admin/gym/athletes/:id/measurements",
    authenticateAdmin,
    requirePermission("edit_user"),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { weight_kg, body_fat_pct, notes } = req.body;

        const [newMeasurement] = await db
          .insert(measurements)
          .values({
            athlete_id: id,
            weight_kg: weight_kg.toString(),
            body_fat_pct: body_fat_pct?.toString(),
            notes,
          })
          .returning();

        // Update athlete current state
        await db
          .update(athletes)
          .set({
            weight_kg: weight_kg.toString(),
            body_fat_pct: body_fat_pct?.toString(),
            updated_at: new Date(),
          })
          .where(eq(athletes.id, id));

        res.status(201).json({
          success: true,
          data: newMeasurement,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Failed to add measurement:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  // ROUTINES
  // Get routines for athlete
  router.get(
    "/admin/gym/athletes/:id/routines",
    authenticateAdmin,
    requirePermission("view_users"),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const athleteRoutines = await db
          .select()
          .from(routines)
          .where(eq(routines.athlete_id, id))
          .orderBy(routines.day_of_week);

        // Fetch exercises for each routine
        const detailedRoutines = await Promise.all(
          athleteRoutines.map(async (r) => {
            const exercisesInRoutine = await db
              .select({
                id: routineExercises.id,
                name: exercises.name,
                muscle_group: exercises.muscle_group,
                sets: routineExercises.sets,
                reps: routineExercises.reps,
                weight_kg: routineExercises.weight_kg,
                completed: routineExercises.completed,
                order: routineExercises.order,
              })
              .from(routineExercises)
              .leftJoin(exercises, eq(routineExercises.exercise_id, exercises.id))
              .where(eq(routineExercises.routine_id, r.id))
              .orderBy(routineExercises.order);

            return { ...r, exercises: exercisesInRoutine };
          })
        );

        res.json({
          success: true,
          data: detailedRoutines,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Failed to fetch routines:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  // EXERCISES
  // List all available exercises
  router.get(
    "/admin/gym/exercises",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const data = await db.select().from(exercises);
        res.json({ success: true, data, timestamp: new Date() });
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );
}
