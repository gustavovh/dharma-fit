import jwt from "jsonwebtoken";
import type { JwtPayload } from "@workspace/admin-sdk";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "15m";

export function jwtSign(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: "HS256",
  });
}

export function jwtVerify(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  }) as JwtPayload;
}

export function jwtSignRefreshToken(): string {
  const expiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";
  return jwt.sign({ type: "refresh" }, JWT_SECRET, {
    expiresIn: expiry,
    algorithm: "HS256",
  });
}
