import { type ReactNode } from "react";

import { StoreProvider } from "./store-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./toaster";

/**
 * Single composition point for all app-wide client providers.
 * Order matters: theme is outermost (no dependencies), then client state
 * (Redux), then server state (React Query). The toaster sits inside the
 * theme provider so it can read the resolved theme.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <StoreProvider>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
