/**
 * User domain types.
 * The base `User` plus role-specific profile shapes for student/teacher/parent.
 */

import type { Role } from "@/config/roles";
import type { ID, ISODateString, Nullable } from "./common";

/** Fields common to every user regardless of role. */
export interface BaseUser {
  id: ID;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: Nullable<string>;
  role: Role;
  isVerified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Student-specific profile data. */
export interface StudentProfile extends BaseUser {
  role: "student";
  grade: Nullable<string>;
  enrolledCourseIds: ID[];
  parentId: Nullable<ID>;
}

/** Teacher-specific profile data (public-facing fields included for SEO pages). */
export interface TeacherProfile extends BaseUser {
  role: "teacher";
  headline: Nullable<string>;
  bio: Nullable<string>;
  subjects: string[];
  ratingAverage: number;
  ratingCount: number;
  courseIds: ID[];
}

/** Parent-specific profile data. */
export interface ParentProfile extends BaseUser {
  role: "parent";
  childrenIds: ID[];
}

/** Discriminated union of all profile shapes. */
export type UserProfile = StudentProfile | TeacherProfile | ParentProfile;

/** Minimal authenticated user stored in client state. */
export interface AuthUser {
  id: ID;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: Nullable<string>;
  role: Role;
}
