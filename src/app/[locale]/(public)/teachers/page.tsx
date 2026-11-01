import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/lib/i18n/routing";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import { buildMetadata } from "@/lib/seo";
import { getTeachers, TeacherList } from "@/features/teachers";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/teachers">): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);
  const t = await getTranslations({ locale: resolved, namespace: "teachers" });

  return buildMetadata({
    locale: resolved,
    path: routes.teachers,
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function TeachersPage({
  params,
}: PageProps<"/[locale]/teachers">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("teachers");
  const teachers = await getTeachers();
  const loc = locale as Locale;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <TeacherList teachers={teachers} locale={loc} />
    </section>
  );
}
