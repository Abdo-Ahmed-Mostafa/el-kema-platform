import type { AuthUser } from "@/types/user";
import type { Role } from "@/config/roles";

/** Payload sent to the login endpoint. */
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Payload sent to the register endpoint. */
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

/** Successful auth response from the backend. */
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}
