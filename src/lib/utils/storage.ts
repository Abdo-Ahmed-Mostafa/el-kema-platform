/**
 * Safe localStorage wrapper.
 * Guards against SSR (no `window`), disabled storage, and JSON parse errors.
 * Returns typed values and never throws.
 */

const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — fail silently.
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
  },

  clear(): void {
    if (!isBrowser) return;
    try {
      window.localStorage.clear();
    } catch {
      // Ignore.
    }
  },
};
