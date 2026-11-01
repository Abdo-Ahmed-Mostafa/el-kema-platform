"use server";

import { revalidateTag } from "next/cache";

import { cacheTags } from "@/config/cache-tags";

/**
 * Server Actions for on-demand cache invalidation.
 *
 * Call these after a mutation (create/update/delete) so the next read of the
 * affected `use cache` data returns fresh results. The `"max"` profile uses
 * stale-while-revalidate: the next request is served stale while fresh data
 * loads in the background — the recommended default for catalog data.
 *
 * For read-your-own-writes flows (a form where the user must see their change
 * immediately), prefer `updateTag` inside the mutating Server Action instead.
 */

export async function revalidateCourses(): Promise<void> {
  revalidateTag(cacheTags.courses, "max");
}

export async function revalidateCourse(slug: string): Promise<void> {
  revalidateTag(cacheTags.course(slug), "max");
}

export async function revalidateTeachers(): Promise<void> {
  revalidateTag(cacheTags.teachers, "max");
}

export async function revalidateTeacher(username: string): Promise<void> {
  revalidateTag(cacheTags.teacher(username), "max");
}
