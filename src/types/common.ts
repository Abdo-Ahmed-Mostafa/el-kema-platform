/**
 * Shared primitive/utility types used across the app.
 */

/** A value that may be null or undefined. */
export type Nullable<T> = T | null | undefined;

/** Make specific keys of T optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific keys of T required. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/** A unique identifier type (keep flexible for string or numeric backends). */
export type ID = string;

/** ISO 8601 date string, e.g. "2026-01-01T00:00:00Z". */
export type ISODateString = string;

/** Generic key-value record. */
export type Dictionary<T = unknown> = Record<string, T>;

/** Standard status for async UI state. */
export type AsyncStatus = "idle" | "loading" | "success" | "error";
