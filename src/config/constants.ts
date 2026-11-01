/**
 * App-wide constants and feature flags.
 * Centralizes tunable values and lets features be toggled without code changes
 * scattered across the app. Flags default off until the backing work lands.
 */

/** Pagination and query defaults. */
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 12,
  maxPageSize: 50,
} as const;

/** Shared UI timings (ms). */
export const TIMINGS = {
  toastDuration: 4000,
  debounceSearch: 300,
} as const;

/**
 * Feature flags. Prefer reading these over scattering `if` checks so a feature
 * can be flipped in one place. Wire to env or a remote config later.
 */
export const FEATURES = {
  /** Public, indexable student profiles (in addition to teachers). */
  studentPublicProfiles: false,
  /** Course reviews & ratings UI. */
  courseReviews: false,
  /** In-app notifications. */
  notifications: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;
