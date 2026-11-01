/**
 * Course domain types.
 */

import type { ID, ISODateString, Nullable } from "./common";

/** Difficulty level of a course. */
export type CourseLevel = "beginner" | "intermediate" | "advanced";

/** Public-facing teacher summary embedded in a course. */
export interface CourseInstructor {
  id: ID;
  username: string;
  name: string;
  avatarUrl: Nullable<string>;
}

/** A course as shown on the public site. */
export interface Course {
  id: ID;
  slug: string;
  title: string;
  description: string;
  summary: string;
  subject: string;
  level: CourseLevel;
  language: string;
  price: number;
  currency: string;
  thumbnailUrl: Nullable<string>;
  instructor: CourseInstructor;
  lessonsCount: number;
  durationHours: number;
  ratingAverage: number;
  ratingCount: number;
  studentsCount: number;
  publishedAt: ISODateString;
  updatedAt: ISODateString;
}

/** Lightweight course shape for cards and lists. */
export type CourseListItem = Pick<
  Course,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "subject"
  | "level"
  | "price"
  | "currency"
  | "thumbnailUrl"
  | "instructor"
  | "ratingAverage"
  | "ratingCount"
  | "studentsCount"
  | "durationHours"
>;
