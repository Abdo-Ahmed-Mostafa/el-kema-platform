import { cacheLife, cacheTag } from "next/cache";

import type { TeacherProfile } from "@/types";
import { cacheTags } from "@/config/cache-tags";
import { mockTeachers } from "./mock-data";

/**
 * Server-side teacher data access, cached with Next's `use cache`.
 *
 * Caches across requests with a `days` lifetime and tag-based invalidation.
 * Swap the bodies for `http.get(endpoints.teachers...)` to go live; the cache
 * wrappers stay the same.
 */

/** List teachers for the public directory. */
export async function getTeachers(): Promise<TeacherProfile[]> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.teachers);

  return mockTeachers;
}

/** Fetch a teacher by username (the public profile slug), or `null`. */
export async function getTeacherByUsername(
  username: string,
): Promise<TeacherProfile | null> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.teachers, cacheTags.teacher(username));

  return mockTeachers.find((t) => t.username === username) ?? null;
}

/** All teacher usernames — used by `generateStaticParams`. */
export async function getTeacherUsernames(): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(cacheTags.teachers);

  return mockTeachers.map((t) => t.username);
}
