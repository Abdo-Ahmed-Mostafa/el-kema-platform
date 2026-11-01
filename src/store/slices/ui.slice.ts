import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Global UI state that is purely client-side and ephemeral:
 * layout chrome (sidebar), command menu, and the active locale mirror.
 * Server data does NOT live here — that belongs to React Query.
 */
export interface UiState {
  /** Whether the dashboard sidebar is expanded (desktop) / open (mobile). */
  sidebarOpen: boolean;
  /** Whether the global command / search palette is open. */
  commandMenuOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  commandMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleCommandMenu(state) {
      state.commandMenuOpen = !state.commandMenuOpen;
    },
    setCommandMenuOpen(state, action: PayloadAction<boolean>) {
      state.commandMenuOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleCommandMenu,
  setCommandMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
