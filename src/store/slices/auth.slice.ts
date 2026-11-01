import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser } from "@/types/user";

/**
 * Optimistic client-side auth state.
 *
 * This is a lightweight mirror of the authenticated session used for instant
 * UI decisions (showing the right nav, guarding client routes). The source of
 * truth for the session remains the server (httpOnly cookies / tokens);
 * fetching the real user is a React Query concern. We only cache the resolved
 * identity here so the UI doesn't flash on navigation.
 */
export interface AuthState {
  user: AuthUser | null;
  /** True once we've attempted to resolve the session at least once. */
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.initialized = true;
    },
    clearUser(state) {
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
