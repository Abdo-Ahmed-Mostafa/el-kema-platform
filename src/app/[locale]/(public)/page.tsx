import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routes } from "@/config/routes";
import { buildMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { routing } from "@/lib/i18n/routing";

import { TrackingSection } from "./_sections/tracking-section";
import { CoursesSection } from "./_sections/courses-section";
import { InstructorsSection } from "./_sections/instructors-section";
import { OffersSection } from "./_sections/offers-section";
import { FaqSectionBlock } from "./_sections/faq-section-block";

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

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[120px] px-5 py-16 lg:py-24">
      <TrackingSection />
      <CoursesSection />
      <InstructorsSection />
      <OffersSection />
      <FaqSectionBlock />
    </div>
  );
}
