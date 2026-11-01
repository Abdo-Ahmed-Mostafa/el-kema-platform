/**
 * User roles and role-based access configuration.
 * Single source of truth for authorization checks across the app
 * (route guards, dashboard routing, conditional rendering).
 */

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  PARENT: "parent",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** All roles as an array, useful for validation and iteration. */
export const roleList = Object.values(ROLES) as Role[];

/** Narrow an arbitrary string to a known Role. */
export function isRole(value: string): value is Role {
  return roleList.includes(value as Role);
}

/**
 * The dashboard landing segment for each role.
 * Used to redirect users to the right dashboard after login.
 */
export const roleDashboardSegment: Record<Role, string> = {
  student: "student",
  teacher: "teacher",
  parent: "parent",
};
