import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./slices/ui.slice";
import authReducer from "./slices/auth.slice";

/**
 * Store factory.
 *
 * All Redux state in this app is client-only (UI toggles + an optimistic auth
 * mirror); nothing is dispatched or mutated during server rendering. That lets
 * us treat the store as a lazy singleton (see `getStore`) rather than creating
 * it inside a component's render — which matters under Cache Components,
 * because `configureStore` reads an unstable value (RTK's internal id) that
 * the prerender validator rejects when it runs during render.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
    },
  });
}

let store: AppStore | undefined;

/**
 * Returns the shared store, creating it once on first access. Created at
 * module scope (not during render), so the unstable value inside
 * `configureStore` is evaluated at import time, not flagged per-render by the
 * prerender. Safe as a singleton here since the server never dispatches.
 */
export function getStore(): AppStore {
  if (!store) {
    store = makeStore();
  }
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
