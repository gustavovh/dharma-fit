/**
 * Database Seeder - Populate con datos iniciales
 * 
 * Ejecutar con:
 * pnpm tsx lib/db/seed.ts
 */

import { db } from "@workspace/db";
import { adminUsers, releases } from "@workspace/db/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Comenzando seeder...\n");

  try {
    // 1. Crear usuario admin de prueba
    console.log("📝 Creando usuarios...");
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

    const adminUser = await db
      .insert(adminUsers)
      .values({
        email: "admin@gym-saga.local",
        name: "Admin",
        password_hash: hashedPassword,
        role: "super_admin",
        status: "active",
        mfa_enabled: false,
      })
      .onConflictDoNothing()
      .returning();

    if (adminUser[0]) {
      console.log("✅ Usuario admin creado:", adminUser[0].email);
    } else {
      console.log("ℹ️  Usuario admin ya existe");
    }

    // 2. Crear releases de prueba
    console.log("\n📦 Creando releases...");
    const testReleases = [
      {
        version: "1.0.0",
        changelog: "Initial release",
        release_notes: "First public release of Gym Saga",
        platforms: {
          android: { available: true },
          ios: { available: true },
          web: { available: true },
        },
        status: "published" as const,
        mandatory: false,
        created_by: adminUser[0]?.id || "00000000-0000-0000-0000-000000000001",
      },
      {
        version: "1.1.0",
        changelog: "Added new features",
        release_notes: "- New workout tracking\n- Improved UI",
        platforms: {
          android: { available: true },
          ios: { available: true },
          web: { available: false },
        },
        status: "draft" as const,
        mandatory: false,
        created_by: adminUser[0]?.id || "00000000-0000-0000-0000-000000000001",
      },
    ];

    for (const releaseData of testReleases) {
      const result = await db
        .insert(releases)
        .values(releaseData)
        .onConflictDoNothing()
        .returning();

      if (result[0]) {
        console.log(`✅ Release ${result[0].version} creada`);
      }
    }

    console.log("\n✨ Seeding completado!");
  } catch (error) {
    console.error("❌ Error durante seeding:", error);
    process.exit(1);
  }
}

seed().then(() => process.exit(0));
