/**
 * Centralized cache tag names for Next's `cacheTag` / `revalidateTag`.
 * Keeping them here avoids magic strings and makes invalidation call sites
 * self-documenting. Entity tags are parameterized by id/slug.
 */
export const cacheTags = {
  courses: "courses",
  course: (slug: string) => `course:${slug}`,
  teachers: "teachers",
  teacher: (username: string) => `teacher:${username}`,
} as const;
