/**
 * API contract types shared across features.
 * Shape these to match your backend. Adjust once the real API is known.
 */

import type { ID } from "./common";

/** Standard successful API envelope. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/** Standard API error payload. */
export interface ApiError {
  message: string;
  statusCode: number;
  // Field-level validation errors, keyed by field name.
  errors?: Record<string, string[]>;
  code?: string;
}

/** Cursor/offset pagination metadata. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Paginated list envelope. */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}

/** Common query params for list endpoints. */
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

/** Reference to an entity by id (useful for relations). */
export interface EntityRef {
  id: ID;
}
