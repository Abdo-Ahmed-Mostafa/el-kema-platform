import { http, endpoints } from "@/lib/api";
import type { AuthUser } from "@/types/user";
import type { AuthResponse, LoginPayload, RegisterPayload } from "./types";

/**
 * Auth API calls. Thin wrappers over the typed `http` helpers using the
 * centralized endpoint paths. Errors are already normalized to `ApiError`
 * by the axios interceptor.
 */
export const authApi = {
  login(payload: LoginPayload) {
    return http.post<AuthResponse>(endpoints.auth.login, payload);
  },

  register(payload: RegisterPayload) {
    return http.post<AuthResponse>(endpoints.auth.register, payload);
  },

  logout() {
    return http.post<void>(endpoints.auth.logout);
  },

  me() {
    return http.get<AuthUser>(endpoints.auth.me);
  },
};
