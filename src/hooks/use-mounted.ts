"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `true` only after the component has mounted on the client.
 * Useful to avoid hydration mismatches for client-only UI (e.g. reading
 * `localStorage` or theme before paint).
 *
 * Implemented with `useSyncExternalStore`: the server snapshot is `false` and
 * the client snapshot is `true`, so React resolves it right after hydration
 * without a setState-in-effect (which the React Compiler lint disallows).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
