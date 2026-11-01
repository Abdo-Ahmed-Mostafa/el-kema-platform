"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps `next-themes` with the app's conventions:
 * - `class` strategy so Tailwind's `dark:` variant works via a `.dark` class.
 * - System preference respected by default.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
