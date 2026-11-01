import { cacheLife, cacheTag } from "next/cache";

import type { Course, CourseListItem } from "@/types";
import { cacheTags } from "@/config/cache-tags";
import { mockCourses } from "./mock-data";

/**
 * Server-side course data access, cached with Next's `use cache`.
 *
 * Each function caches its output across requests (not just per-request like
 * React's `cache`), with a `days` lifetime and on-demand invalidation via
 * tags — so a mutation can call `revalidateTag(cacheTags.courses)` to refresh.
 * Today they read from mock data; to go live, replace the bodies with
 * `http.get(endpoints.courses...)` calls — the cache wrappers stay the same.
 */

function toListItem(course: Course): CourseListItem {
  const {
    id,
    slug,
    title,
    summary,
    subject,
    level,
    price,
    currency,
    thumbnailUrl,
    instructor,
    ratingAverage,
    ratingCount,
    studentsCount,
    durationHours,
  } = course;
  return {
    id,
    slug,
    title,
    summary,
    subject,
    level,
    price,
    currency,
    thumbnailUrl,
    instructor,
    ratingAverage,
    ratingCount,
    studentsCount,
    durationHours,
  };
}

/** List courses for the public catalog. */
export async function getCourses(): Promise<CourseListItem[]> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.courses);

  return mockCourses.map(toListItem);
}

/** Fetch a single course by its slug, or `null` if not found. */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  "use cache";
  cacheLife("days");
  cacheTag(cacheTags.courses, cacheTags.course(slug));

  return mockCourses.find((c) => c.slug === slug) ?? null;
}

/** All course slugs — used by `generateStaticParams`. */
export async function getCourseSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(cacheTags.courses);

  return mockCourses.map((c) => c.slug);
}
