import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/lib/i18n/routing";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import { buildMetadata } from "@/lib/seo";
import { getCourses, CourseList } from "@/features/courses";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/courses">): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);
  const t = await getTranslations({ locale: resolved, namespace: "courses" });

  return buildMetadata({
    locale: resolved,
    path: routes.courses,
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function CoursesPage({
  params,
}: PageProps<"/[locale]/courses">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("courses");
  const courses = await getCourses();
  // Safe: the [locale] layout already rejects unknown locales via notFound().
  const loc = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <CourseList courses={courses} locale={loc} />
    </section>
  );
}
