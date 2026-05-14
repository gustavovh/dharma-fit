import type { Request, Response, Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { attendance, routines, routineExercises, exercises } from "@workspace/db/schema";
import { authenticateAthlete } from "../../middlewares/auth.js";

export async function createRoutineRoutes(router: Router) {
  const fetchRoutines = async (athleteId: string) => {
    const athleteRoutines = await db
      .select()
      .from(routines)
      .where(eq(routines.athlete_id, athleteId));

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

    return routinesWithExercises;
  };

  // Get routines for current athlete (preferred endpoint)
  router.get("/atleta/routines", authenticateAthlete, async (req: Request, res: Response) => {
    try {
      const athleteId = req.athlete?.id;

      if (!athleteId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const data = await fetchRoutines(athleteId);

      return res.json({
        success: true,
        data,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Fetch routines error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Mark exercise as complete
  router.post("/atleta/routines/complete", authenticateAthlete, async (req: Request, res: Response) => {
    try {
      const { routineExerciseId, completed } = req.body;

      if (!routineExerciseId || typeof completed !== "boolean") {
        return res.status(400).json({
          success: false,
          error: "routineExerciseId and completed are required",
        });
      }

      const athleteId = req.athlete?.id;

      if (!athleteId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const [ownedExercise] = await db
        .select({
          id: routineExercises.id,
          trainer_id: routines.trainer_id,
        })
        .from(routineExercises)
        .innerJoin(routines, eq(routineExercises.routine_id, routines.id))
        .where(
          and(
            eq(routineExercises.id, routineExerciseId),
            eq(routines.athlete_id, athleteId)
          )
        );

      if (!ownedExercise) {
        return res.status(404).json({
          success: false,
          error: "Exercise not found",
        });
      }

      await db
        .update(routineExercises)
        .set({ completed })
        .where(eq(routineExercises.id, routineExerciseId));

      if (completed) {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const existingToday = await db
          .select({ id: attendance.id })
          .from(attendance)
          .where(
            and(
              eq(attendance.athlete_id, athleteId),
              eq(attendance.date, startOfDay)
            )
          )
          .limit(1);

        if (!existingToday.length) {
          await db.insert(attendance).values({
            trainer_id: ownedExercise.trainer_id,
            athlete_id: athleteId,
            date: startOfDay,
            time: `${now.getHours().toString().padStart(2, "0")}:${now
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
          });
        }
      }

      res.json({
        success: true,
        message: "Exercise status updated",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
}
