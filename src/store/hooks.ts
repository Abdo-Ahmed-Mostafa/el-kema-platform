import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "./index";

/**
 * Pre-typed Redux hooks. Always use these instead of the plain
 * `useDispatch` / `useSelector` so state and dispatch are fully typed.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
