"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

/**
 * Sonner toaster wired to the active theme from `next-themes`.
 * Direction (RTL/LTR) is inherited from the `dir` attribute on <html>,
 * which the locale layout already sets.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      position="top-center"
    />
  );
}
