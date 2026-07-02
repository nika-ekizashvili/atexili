// Prisma 7 config — connection URLs live here now, not in schema.prisma.
// Prisma no longer auto-loads .env, so load it explicitly (Node 20.12+).
try {
  process.loadEnvFile();
} catch {
  // no .env present (e.g. CI with real env vars) — fine
}

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
  migrations: { seed: "node prisma/seed.mjs" },
});
