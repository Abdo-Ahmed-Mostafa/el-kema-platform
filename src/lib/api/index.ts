/**
 * Public surface of the API layer.
 * Import from `@/lib/api` rather than reaching into individual modules.
 */

export { api, http, normalizeError } from "./axios";
export { tokenStore } from "./token";
export { endpoints } from "./endpoints";
export { getQueryClient } from "./query-client";
export { HydrateQuery } from "./hydration";
