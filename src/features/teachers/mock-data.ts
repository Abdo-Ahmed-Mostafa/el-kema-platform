import type { TeacherProfile } from "@/types";

/**
 * Temporary in-memory teacher data. Mirrors the course mock approach — swap
 * `data.ts` to the live API later without touching callers. The `username`
 * doubles as the public profile slug.
 */
export const mockTeachers: TeacherProfile[] = [
  {
    id: "t1",
    username: "sara-hassan",
    firstName: "Sara",
    lastName: "Hassan",
    email: "sara@example.com",
    avatarUrl: null,
    role: "teacher",
    isVerified: true,
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
    headline: "Chemistry educator & curriculum designer",
    bio: "Sara has taught chemistry for over a decade, helping thousands of students build intuition for the subject through clear, example-driven lessons.",
    subjects: ["Chemistry", "Organic Chemistry"],
    ratingAverage: 4.9,
    ratingCount: 522,
    courseIds: ["c1", "c2"],
  },
  {
    id: "t2",
    username: "omar-khaled",
    firstName: "Omar",
    lastName: "Khaled",
    email: "omar@example.com",
    avatarUrl: null,
    role: "teacher",
    isVerified: true,
    createdAt: "2025-10-15T00:00:00Z",
    updatedAt: "2026-09-20T00:00:00Z",
    headline: "Mathematics teacher focused on fundamentals",
    bio: "Omar specializes in making algebra and calculus approachable, breaking down complex topics into simple, repeatable steps.",
    subjects: ["Mathematics", "Algebra"],
    ratingAverage: 4.7,
    ratingCount: 184,
    courseIds: ["c3"],
  },
];
