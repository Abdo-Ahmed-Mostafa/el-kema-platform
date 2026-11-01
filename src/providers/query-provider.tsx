"use client";

import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/lib/api/query-client";

/**
 * Provides the React Query client to the client tree.
 *
 * `getQueryClient()` returns a fresh client on the server and a browser
 * singleton on the client, so we intentionally do NOT memoize with a ref here
 * (that would break the server/singleton split).
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
