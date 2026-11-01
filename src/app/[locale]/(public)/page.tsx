import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { routing } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);

  const t = await getTranslations({ locale: resolved, namespace: "home" });

  return buildMetadata({
    locale: resolved,
    path: routes.home,
    title: t("heroTitle"),
    description: t("heroSubtitle"),
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("heroSubtitle")}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={routes.register}>{t("getStarted")}</Link>
        </Button>
        <Button asChild size="lg" appearance="outline">
          <Link href={routes.courses}>{t("browseCourses")}</Link>
        </Button>
      </div>
    </section>
  );
}
