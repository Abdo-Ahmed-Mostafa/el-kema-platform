import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { StarIcon, UsersIcon, ClockIcon, BookOpenIcon } from "lucide-react";

import { routing } from "@/lib/i18n/routing";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { buildMetadata, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";
import { getCourseBySlug, getCourseSlugs } from "@/features/courses";

/** Prerender a page per course slug. */
export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/courses/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);

  const course = await getCourseBySlug(slug);
  if (!course) {
    // Trigger the 404 at the metadata stage so the response status is set to
    // 404 before the page body renders (avoids a soft-404 / HTTP 200).
    notFound();
  }

  return buildMetadata({
    locale: resolved,
    path: routes.course(slug),
    title: course.title,
    description: course.summary,
    image: course.thumbnailUrl ?? undefined,
    keywords: [course.subject, course.instructor.name],
  });
}

export default async function CourseDetailsPage({
  params,
}: PageProps<"/[locale]/courses/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const t = await getTranslations("courses");
  const loc = locale as Locale;
  const canonical = `${siteConfig.url}/${locale}${routes.course(slug)}`;

  const price =
    course.price === 0
      ? t("free")
      : formatCurrency(course.price, loc, course.currency);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: course.title,
          description: course.description,
          url: canonical,
          instructorName: course.instructor.name,
          image: course.thumbnailUrl ?? undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: t("title"),
            url: `${siteConfig.url}/${locale}${routes.courses}`,
          },
          { name: course.title, url: canonical },
        ])}
      />

      <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <span className="text-primary text-sm font-medium">
            {course.subject} · {t(`level.${course.level}`)}
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h1>
          <p className="text-muted-foreground text-lg">{course.summary}</p>
          <p className="text-muted-foreground text-sm">
            {t("by", { name: course.instructor.name })}
          </p>
        </header>

        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <StarIcon className="size-4 fill-amber-400 text-amber-400" />
            {formatNumber(course.ratingAverage, loc)} ({course.ratingCount})
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon className="size-4" />
            {t("students", { count: formatNumber(course.studentsCount, loc) })}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpenIcon className="size-4" />
            {t("lessons", { count: formatNumber(course.lessonsCount, loc) })}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            {t("hours", { count: formatNumber(course.durationHours, loc) })}
          </span>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <span className="text-2xl font-bold">{price}</span>
          <Button size="lg">{t("enroll")}</Button>
        </div>

        <div className="mt-10 border-t pt-8">
          <p className="leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>
      </article>
    </>
  );
}
