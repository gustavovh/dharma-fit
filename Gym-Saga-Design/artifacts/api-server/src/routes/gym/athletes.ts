import type { Request, Response, Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { athletes, adminSessions } from "@workspace/db/schema";
import { jwtSign, jwtSignRefreshToken } from "../../middlewares/jwt.js";
import bcrypt from "bcrypt";

export async function createAthleteRoutes(router: Router) {
  // Athlete Login
  router.post("/atleta/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        });
      }

      const [athlete] = await db
        .select()
        .from(athletes)
        .where(eq(athletes.email, email));

      if (!athlete) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const isValid = await bcrypt.compare(password, athlete.password_hash);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Crear tokens
      const accessToken = jwtSign({
        sub: athlete.id,
        email: athlete.email,
        role: "athlete",
        permissions: ["athlete:read", "athlete:write"],
      });

      const refreshToken = jwtSignRefreshToken();

      res.json({
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: {
            id: athlete.id,
            email: athlete.email,
            name: athlete.name,
            role: "athlete",
            avatar: athlete.avatar,
          },
        },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Athlete login error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // Get athlete profile
  router.get("/atleta/profile/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [athlete] = await db
        .select()
        .from(athletes)
        .where(eq(athletes.id, id));

      if (!athlete) {
        return res.status(404).json({
          success: false,
          error: "Athlete not found",
        });
      }

      res.json({
        success: true,
        data: athlete,
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
}
