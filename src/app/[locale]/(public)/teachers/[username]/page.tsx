import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { StarIcon, BookOpenIcon } from "lucide-react";

import { routing } from "@/lib/i18n/routing";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { buildMetadata, personJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils/formatters";
import { getTeacherByUsername, getTeacherUsernames } from "@/features/teachers";

/** Prerender a page per teacher username. */
export async function generateStaticParams() {
  const usernames = await getTeacherUsernames();
  return usernames.map((username) => ({ username }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/teachers/[username]">): Promise<Metadata> {
  const { locale, username } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);

  const teacher = await getTeacherByUsername(username);
  if (!teacher) {
    // Trigger the 404 at the metadata stage so the response status is set to
    // 404 before the page body renders (avoids a soft-404 / HTTP 200).
    notFound();
  }

  const name = `${teacher.firstName} ${teacher.lastName}`;
  return buildMetadata({
    locale: resolved,
    path: routes.teacher(username),
    title: name,
    description: teacher.headline ?? teacher.bio ?? undefined,
    image: teacher.avatarUrl ?? undefined,
    keywords: teacher.subjects,
  });
}

export default async function TeacherProfilePage({
  params,
}: PageProps<"/[locale]/teachers/[username]">) {
  const { locale, username } = await params;
  setRequestLocale(locale);

  const teacher = await getTeacherByUsername(username);
  if (!teacher) notFound();

  const t = await getTranslations("teachers");
  const loc = locale as Locale;
  const name = `${teacher.firstName} ${teacher.lastName}`;
  const initials =
    `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase();
  const canonical = `${siteConfig.url}/${locale}${routes.teacher(username)}`;

  return (
    <>
      <JsonLd
        data={personJsonLd({
          name,
          url: canonical,
          jobTitle: teacher.headline ?? undefined,
          description: teacher.bio ?? undefined,
          image: teacher.avatarUrl ?? undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          {
            name: t("title"),
            url: `${siteConfig.url}/${locale}${routes.teachers}`,
          },
          { name, url: canonical },
        ])}
      />

      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-start">
          <Avatar className="size-24">
            {teacher.avatarUrl ? (
              <AvatarImage src={teacher.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            {teacher.headline ? (
              <p className="text-muted-foreground text-lg">
                {teacher.headline}
              </p>
            ) : null}
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
              <span className="flex items-center gap-1.5">
                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                {t("rating", {
                  rating: formatNumber(teacher.ratingAverage, loc),
                  count: teacher.ratingCount,
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpenIcon className="size-4" />
                {t("coursesCount", { count: teacher.courseIds.length })}
              </span>
            </div>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {teacher.subjects.map((subject) => (
            <span
              key={subject}
              className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
            >
              {subject}
            </span>
          ))}
        </div>

        {teacher.bio ? (
          <div className="mt-8 border-t pt-8">
            <p className="leading-relaxed">{teacher.bio}</p>
          </div>
        ) : null}
      </article>
    </>
  );
}
