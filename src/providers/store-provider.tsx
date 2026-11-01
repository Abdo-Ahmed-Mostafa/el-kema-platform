"use client";

import { type ReactNode } from "react";
import { Provider } from "react-redux";

import { getStore } from "@/store";

/**
 * Provides the Redux store to the client tree.
 *
 * The store is a lazy module singleton (`getStore`) created at import time, not
 * during render. This keeps `configureStore`'s internal unstable value out of
 * the per-render prerender path — so no `<Suspense>` workaround is needed above
 * the app, which in turn keeps `notFound()` returning a real 404 instead of a
 * soft 200.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={getStore()}>{children}</Provider>;
}
