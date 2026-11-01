import { getTranslations } from "next-intl/server";

import type { Locale } from "@/config/locales";
import type { CourseListItem } from "@/types";
import { CourseCard } from "./course-card";

/**
 * Responsive grid of course cards. Server Component.
 */
export async function CourseList({
  courses,
  locale,
}: {
  courses: CourseListItem[];
  locale: Locale;
}) {
  const t = await getTranslations("courses");

  if (courses.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">{t("empty")}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} locale={locale} />
      ))}
    </div>
  );
}
