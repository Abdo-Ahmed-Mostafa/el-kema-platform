/**
 * Centralized route definitions — no hardcoded path strings elsewhere.
 * Paths here are locale-agnostic (no `/ar` or `/en` prefix). Use the
 * `localized()` helper, or next-intl's navigation, to add the locale prefix.
 */

export const routes = {
  // Public site
  home: "/",
  courses: "/courses",
  course: (slug: string) => `/courses/${slug}`,
  teachers: "/teachers",
  teacher: (username: string) => `/teachers/${username}`,
  student: (username: string) => `/students/${username}`,
  about: "/about",
  contact: "/contact",

  // Auth
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  // Dashboards (role-based)
  dashboard: {
    student: {
      root: "/student",
      courses: "/student/courses",
      profile: "/student/profile",
    },
    teacher: {
      root: "/teacher",
      courses: "/teacher/courses",
      students: "/teacher/students",
    },
    parent: {
      root: "/parent",
      children: "/parent/children",
    },
  },
} as const;

/** Route segments that require authentication (matched by prefix). */
export const protectedPrefixes = ["/student", "/teacher", "/parent"] as const;

/** Auth pages — authenticated users should be redirected away from these. */
export const authPaths = ["/login", "/register", "/forgot-password"] as const;

/**
 * Prefix a locale-agnostic path with a locale segment.
 * @example localized("/courses", "ar") -> "/ar/courses"
 */
export function localized(path: string, locale: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
