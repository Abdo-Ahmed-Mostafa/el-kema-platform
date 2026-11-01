/**
 * Type-safe environment variables validated with Zod.
 *
 * Importing this module validates `process.env` at startup and throws a clear
 * error if a required variable is missing or malformed — so misconfiguration
 * fails fast instead of surfacing as a runtime bug deep in the app.
 *
 * Only `NEXT_PUBLIC_*` variables are available in the browser. Server-only
 * secrets must never use the `NEXT_PUBLIC_` prefix.
 */

import { z } from "zod";

const envSchema = z.object({
  // Runtime environment.
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Public app URL (used for SEO, canonical URLs, sitemap).
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Base URL of the backend API.
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables. Check your .env file.");
}

export const env = parsed.data;

export type Env = typeof env;

/**
 * Server-only environment variables.
 *
 * These must NEVER use the `NEXT_PUBLIC_` prefix and must never be imported
 * into a Client Component (doing so would leak secrets into the bundle).
 * Keep this schema minimal until real secrets exist; add them here (e.g. an
 * API secret, a database URL) and read via `serverEnv()`.
 */
const serverEnvSchema = z.object({
  // Example (add when needed):
  // API_SECRET: z.string().min(1),
});

let serverEnvCache: z.infer<typeof serverEnvSchema> | undefined;

/**
 * Lazily validate and return server-only env. Call from server code only.
 * Throws a clear error if a required server variable is missing.
 */
export function serverEnv(): z.infer<typeof serverEnvSchema> {
  if (serverEnvCache) return serverEnvCache;

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      "❌ Invalid server environment variables:",
      z.treeifyError(result.error),
    );
    throw new Error("Invalid server environment variables.");
  }
  serverEnvCache = result.data;
  return serverEnvCache;
}
