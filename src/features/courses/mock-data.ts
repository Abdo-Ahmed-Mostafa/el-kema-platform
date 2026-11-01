import type { Course } from "@/types";

/**
 * Temporary in-memory course data.
 *
 * Stands in for the backend until the real API is wired. The feature's data
 * functions read from here; swapping to the live API is a one-file change in
 * `data.ts`. Keep this shape in sync with the `Course` type.
 */
export const mockCourses: Course[] = [
  {
    id: "c1",
    slug: "intro-to-chemistry",
    title: "Introduction to Chemistry",
    summary: "Build a solid foundation in general chemistry from scratch.",
    description:
      "A beginner-friendly course covering atoms, the periodic table, chemical bonding, reactions, and stoichiometry. Includes worked examples and practice problems designed for high-school and early-college students.",
    subject: "Chemistry",
    level: "beginner",
    language: "en",
    price: 0,
    currency: "EGP",
    thumbnailUrl: null,
    instructor: {
      id: "t1",
      username: "sara-hassan",
      name: "Sara Hassan",
      avatarUrl: null,
    },
    lessonsCount: 24,
    durationHours: 8,
    ratingAverage: 4.8,
    ratingCount: 312,
    studentsCount: 1540,
    publishedAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "c2",
    slug: "organic-chemistry-essentials",
    title: "Organic Chemistry Essentials",
    summary: "Master functional groups, reactions, and mechanisms.",
    description:
      "An intermediate course on organic chemistry: nomenclature, functional groups, reaction mechanisms, stereochemistry, and spectroscopy. Ideal for students preparing for university-level exams.",
    subject: "Chemistry",
    level: "intermediate",
    language: "en",
    price: 499,
    currency: "EGP",
    thumbnailUrl: null,
    instructor: {
      id: "t1",
      username: "sara-hassan",
      name: "Sara Hassan",
      avatarUrl: null,
    },
    lessonsCount: 40,
    durationHours: 16,
    ratingAverage: 4.9,
    ratingCount: 210,
    studentsCount: 870,
    publishedAt: "2026-03-10T00:00:00Z",
    updatedAt: "2026-10-05T00:00:00Z",
  },
  {
    id: "c3",
    slug: "algebra-foundations",
    title: "Algebra Foundations",
    summary: "From linear equations to quadratics, explained simply.",
    description:
      "A complete algebra course covering expressions, equations, inequalities, functions, and graphing. Step-by-step lessons with plenty of practice to build confidence.",
    subject: "Mathematics",
    level: "beginner",
    language: "ar",
    price: 299,
    currency: "EGP",
    thumbnailUrl: null,
    instructor: {
      id: "t2",
      username: "omar-khaled",
      name: "Omar Khaled",
      avatarUrl: null,
    },
    lessonsCount: 30,
    durationHours: 12,
    ratingAverage: 4.7,
    ratingCount: 184,
    studentsCount: 1120,
    publishedAt: "2026-02-20T00:00:00Z",
    updatedAt: "2026-08-18T00:00:00Z",
  },
];
