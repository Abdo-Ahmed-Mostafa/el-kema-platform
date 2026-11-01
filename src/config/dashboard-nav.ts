import { routes } from "./routes";
import type { Role } from "./roles";

/**
 * Sidebar navigation per role.
 * `labelKey` references the `dashboard` message namespace; `iconName` is a
 * lucide icon name resolved in the Sidebar component (keeps this config free
 * of React imports).
 */
export interface DashboardNavItem {
  href: string;
  labelKey: string;
  iconName: "layout-dashboard" | "book-open" | "users" | "user" | "baby";
}

export const dashboardNav: Record<Role, DashboardNavItem[]> = {
  student: [
    {
      href: routes.dashboard.student.root,
      labelKey: "overview",
      iconName: "layout-dashboard",
    },
    {
      href: routes.dashboard.student.courses,
      labelKey: "myCourses",
      iconName: "book-open",
    },
    {
      href: routes.dashboard.student.profile,
      labelKey: "profile",
      iconName: "user",
    },
  ],
  teacher: [
    {
      href: routes.dashboard.teacher.root,
      labelKey: "overview",
      iconName: "layout-dashboard",
    },
    {
      href: routes.dashboard.teacher.courses,
      labelKey: "myCourses",
      iconName: "book-open",
    },
    {
      href: routes.dashboard.teacher.students,
      labelKey: "students",
      iconName: "users",
    },
  ],
  parent: [
    {
      href: routes.dashboard.parent.root,
      labelKey: "overview",
      iconName: "layout-dashboard",
    },
    {
      href: routes.dashboard.parent.children,
      labelKey: "children",
      iconName: "baby",
    },
  ],
};
