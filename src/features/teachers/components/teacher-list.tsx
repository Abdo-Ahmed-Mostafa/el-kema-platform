import { getTranslations } from "next-intl/server";

import type { Locale } from "@/config/locales";
import type { TeacherProfile } from "@/types";
import { TeacherCard } from "./teacher-card";

/**
 * Responsive grid of teacher cards. Server Component.
 */
export async function TeacherList({
  teachers,
  locale,
}: {
  teachers: TeacherProfile[];
  locale: Locale;
}) {
  const t = await getTranslations("teachers");

  if (teachers.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">{t("empty")}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} locale={locale} />
      ))}
    </div>
  );
}
