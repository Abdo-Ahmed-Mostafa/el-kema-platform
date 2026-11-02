import { getTranslations } from "next-intl/server";

import { OfferCard } from "@/components/organisms";

/**
 * Home section 4 — the second "تابع تقدّمك في رحلتك التعليمية" band.
 *
 * A heading block plus a responsive 2-column row of `OfferCard` organisms: a
 * teal instructor offer and a gold course offer, each with a bleeding
 * illustration. Copy comes from `home.homePage.offers`.
 */
export async function OffersSection() {
  const t = await getTranslations("home.homePage.offers");

  return (
    <section className="flex w-full flex-col items-end gap-[60px]">
      <div className="flex w-full flex-col items-end gap-3 text-end">
        <h2 className="text-[36px] leading-[48px] font-semibold text-primary">
          {t("heading")}
        </h2>
        <p className="text-lg leading-7 font-medium text-secondary">
          {t("subheading")}
        </p>
      </div>
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <OfferCard
          surface="teal"
          illustrationSrc="/home/offer-instructor.png"
          illustrationAlt={t("instructor.imageAlt")}
          badgeLabel={t("badge")}
          title={t("instructor.title")}
          body={t("instructor.body")}
          ctaLabel={t("instructor.cta")}
        />
        <OfferCard
          surface="gold"
          illustrationSrc="/home/offer-books.png"
          illustrationAlt={t("course.imageAlt")}
          badgeLabel={t("badge")}
          title={t("course.title")}
          body={t("course.body")}
          ctaLabel={t("course.cta")}
        />
      </div>
    </section>
  );
}
