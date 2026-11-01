import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/env";
import type { ApiError } from "@/types/api";
import { tokenStore } from "./token";
import { endpoints } from "./endpoints";

/**
 * Extend the request config with a one-shot retry flag so we never attempt to
 * refresh + retry the same request more than once.
 */
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Shared axios instance.
 * - `baseURL` comes from validated env.
 * - `withCredentials` is enabled so cookie-based sessions work too, if the
 *   backend uses them alongside (or instead of) bearer tokens.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/* Request interceptor — attach the access token                             */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/* -------------------------------------------------------------------------- */
/* Response interceptor — refresh on 401, normalize errors                   */
/* -------------------------------------------------------------------------- */

/**
 * Single in-flight refresh promise. Concurrent 401s wait on the same refresh
 * instead of each firing their own, preventing a refresh stampede.
 */
let refreshPromise: Promise<string> | null = null;

/**
 * Perform the token refresh with a bare axios call (not `api`) so it doesn't
 * recurse through these interceptors. Returns the new access token.
 */
async function performRefresh(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<{
    accessToken: string;
    refreshToken?: string;
  }>(
    `${env.NEXT_PUBLIC_API_URL}${endpoints.auth.refresh}`,
    { refreshToken },
    { withCredentials: true },
  );

  const { accessToken, refreshToken: newRefresh } = response.data;
  tokenStore.set({ accessToken, refreshToken: newRefresh });
  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    // Attempt a one-time refresh + retry on 401 (but never for the refresh
    // call itself, and only once per request).
    const isRefreshCall = original?.url?.includes(endpoints.auth.refresh);
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? performRefresh();
        const newToken = await refreshPromise;
        refreshPromise = null;

        const headers = AxiosHeaders.from(original.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        original.headers = headers;

        return api(original);
      } catch (refreshError) {
        refreshPromise = null;
        tokenStore.clear();
        return Promise.reject(normalizeError(refreshError));
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

/* -------------------------------------------------------------------------- */
/* Error normalization                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Convert any thrown value into the app's canonical `ApiError` shape, so
 * callers (React Query, forms) always handle one predictable structure.
 */
export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiError> | undefined;
    return {
      message:
        data?.message ??
        error.message ??
        "An unexpected network error occurred.",
      statusCode: data?.statusCode ?? error.response?.status ?? 0,
      errors: data?.errors,
      code: data?.code ?? error.code,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, statusCode: 0 };
  }

  return { message: "An unexpected error occurred.", statusCode: 0 };
}

/* -------------------------------------------------------------------------- */
/* Typed request helpers                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Thin typed helpers that unwrap the axios response to the payload `T`.
 * Features call these instead of touching `api` directly, keeping call sites
 * terse and consistent. Errors are already normalized by the interceptor.
 */
export const http = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return api.get<T>(url, config).then((r) => r.data);
  },
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return api.post<T>(url, body, config).then((r) => r.data);
  },
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return api.put<T>(url, body, config).then((r) => r.data);
  },
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    return api.patch<T>(url, body, config).then((r) => r.data);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return api.delete<T>(url, config).then((r) => r.data);
  },
};
