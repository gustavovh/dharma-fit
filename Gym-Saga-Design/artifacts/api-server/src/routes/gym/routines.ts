import type { Request, Response, Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { routines, routineExercises, exercises } from "@workspace/db/schema";

export async function createRoutineRoutes(router: Router) {
  // Get routines for an athlete
  router.get("/atleta/routines/:athleteId", async (req: Request, res: Response) => {
    try {
      const { athleteId } = req.params;

      // Fetch routines
      const athleteRoutines = await db
        .select()
        .from(routines)
        .where(eq(routines.athlete_id, athleteId));

      // For each routine, fetch exercises
      const routinesWithExercises = await Promise.all(
        athleteRoutines.map(async (r) => {
          const items = await db
            .select({
              id: routineExercises.id,
              name: routineExercises.name_override,
              sets: routineExercises.sets,
              reps: routineExercises.reps,
              weightKg: routineExercises.weight_kg,
              restSeconds: routineExercises.rest_seconds,
              completed: routineExercises.completed,
              notes: routineExercises.notes,
              media: {
                url: routineExercises.media_url,
                type: routineExercises.media_type,
              },
              exerciseId: routineExercises.exercise_id,
            })
            .from(routineExercises)
            .where(eq(routineExercises.routine_id, r.id));

          return {
            ...r,
            exercises: items,
          };
        })
      );

      res.json({
        success: true,
        data: routinesWithExercises,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Fetch routines error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Mark exercise as complete
  router.post("/atleta/routines/complete", async (req: Request, res: Response) => {
    try {
      const { routineExerciseId, completed } = req.body;

      await db
        .update(routineExercises)
        .set({ completed })
        .where(eq(routineExercises.id, routineExerciseId));

      res.json({
        success: true,
        message: "Exercise status updated",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
}
