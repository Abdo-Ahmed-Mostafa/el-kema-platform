import { type ReactNode } from "react";
import {
  dehydrate,
  HydrationBoundary,
  type FetchQueryOptions,
} from "@tanstack/react-query";

import { getQueryClient } from "./query-client";

/**
 * Server-side prefetch + hydration helper for React Query.
 *
 * Usage in a Server Component:
 *
 *   <HydrateQuery queries={[{ queryKey, queryFn }]}>
 *     <ClientComponentThatUsesUseQuery />
 *   </HydrateQuery>
 *
 * Each query is prefetched on the server using a request-scoped QueryClient,
 * then the dehydrated cache is handed to a `HydrationBoundary` so client
 * components read the data instantly without a second fetch.
 */
export async function HydrateQuery({
  queries,
  children,
}: {
  // Accept loosely-typed query options so callers can pass any key/fn pair.
  queries: FetchQueryOptions[];
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  await Promise.all(queries.map((query) => queryClient.prefetchQuery(query)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
