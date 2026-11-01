import { storage } from "@/lib/utils/storage";
import { storageKeys } from "@/config/storage-keys";

const isBrowser = typeof window !== "undefined";

/**
 * Mirror access-token presence into a cookie so the proxy (which can't read
 * localStorage) can do an optimistic auth check. This is NOT the token itself
 * used for auth — it's a presence flag for routing UX only. Real tokens live
 * in localStorage; real authorization happens server-side.
 */
function setPresenceCookie(present: boolean): void {
  if (!isBrowser) return;
  if (present) {
    // Session cookie (no Max-Age) — cleared when the browser closes.
    document.cookie = `${storageKeys.accessToken}=1; path=/; SameSite=Lax`;
  } else {
    document.cookie = `${storageKeys.accessToken}=; path=/; Max-Age=0; SameSite=Lax`;
  }
}

/**
 * Access / refresh token store.
 *
 * Single source of truth for reading and writing auth tokens on the client.
 * Backed by the SSR-safe `storage` util so it never throws on the server
 * (where it simply returns null / no-ops).
 *
 * If the backend later moves to httpOnly cookies, only this module changes —
 * the axios layer and the rest of the app keep calling the same API.
 */
export const tokenStore = {
  getAccess(): string | null {
    return storage.get<string | null>(storageKeys.accessToken, null);
  },

  getRefresh(): string | null {
    return storage.get<string | null>(storageKeys.refreshToken, null);
  },

  set(tokens: { accessToken: string; refreshToken?: string }): void {
    storage.set(storageKeys.accessToken, tokens.accessToken);
    if (tokens.refreshToken !== undefined) {
      storage.set(storageKeys.refreshToken, tokens.refreshToken);
    }
    setPresenceCookie(true);
  },

  clear(): void {
    storage.remove(storageKeys.accessToken);
    storage.remove(storageKeys.refreshToken);
    setPresenceCookie(false);
  },
};
