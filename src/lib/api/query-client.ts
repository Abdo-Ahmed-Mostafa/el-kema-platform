import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * Creates a QueryClient with sensible defaults for an SSR/App Router app.
 * - A non-zero `staleTime` avoids refetching immediately on the client for
 *   data that was already fetched on the server.
 * - `dehydrate` is configured to also ship pending queries so streamed,
 *   prefetched data hydrates correctly.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the QueryClient to use.
 * - On the server: always a fresh client per request.
 * - On the browser: a shared singleton so state survives re-renders and
 *   React Suspense boundaries.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
