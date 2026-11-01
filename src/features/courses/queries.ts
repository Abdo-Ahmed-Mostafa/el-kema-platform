import { http, endpoints } from "@/lib/api";
import type { Course, CourseListItem } from "@/types";

/**
 * React Query keys + options for courses.
 *
 * Use these for *client-side* queries and for server prefetch via
 * `HydrateQuery`. For purely server-rendered pages, the cached functions in
 * `data.ts` are simpler. These options hit the live API (`http`), so they
 * become active once the backend is connected.
 */
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  detail: (slug: string) => [...courseKeys.all, "detail", slug] as const,
};

export const coursesListQuery = () => ({
  queryKey: courseKeys.lists(),
  queryFn: () => http.get<CourseListItem[]>(endpoints.courses.list),
});

export const courseDetailQuery = (slug: string) => ({
  queryKey: courseKeys.detail(slug),
  queryFn: () => http.get<Course>(endpoints.courses.detail(slug)),
});
