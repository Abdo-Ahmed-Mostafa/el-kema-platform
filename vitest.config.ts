import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vitest config for unit + component tests.
 * - `tsconfigPaths` resolves our `@/*` aliases.
 * - `jsdom` provides a DOM for component tests.
 * - `setupFiles` wires jest-dom matchers and cleanup.
 * E2E (Playwright) lives separately under `e2e/` and is excluded here.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    css: false,
  },
});
