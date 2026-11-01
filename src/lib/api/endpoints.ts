/**
 * Centralized API endpoint paths.
 * All paths are relative to `env.NEXT_PUBLIC_API_URL`. No endpoint strings
 * should be hardcoded in features — reference these instead.
 */

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  courses: {
    list: "/courses",
    detail: (slug: string) => `/courses/${slug}`,
  },
  teachers: {
    list: "/teachers",
    detail: (username: string) => `/teachers/${username}`,
  },
  students: {
    detail: (username: string) => `/students/${username}`,
  },
} as const;
