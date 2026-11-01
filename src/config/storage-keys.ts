/**
 * Centralized localStorage / cookie key names.
 * Keeping these here avoids magic strings scattered across the app and makes
 * it easy to namespace or version storage later.
 */

const PREFIX = "elkema";

export const storageKeys = {
  accessToken: `${PREFIX}.accessToken`,
  refreshToken: `${PREFIX}.refreshToken`,
  theme: "theme", // owned by next-themes; kept here for discoverability
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
