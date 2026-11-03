import { getTranslations } from "next-intl/server";

import { ProgressTrackingCard } from "@/components/organisms";
import { Carousel } from "@/components/shared";

/**
 * Home section 1 — "تابع تقدّمك في رحلتك التعليمية".
 *
 * A thin server-component wrapper: a heading block plus a horizontal carousel of
 * three equal-width `ProgressTrackingCard` organisms (navy / teal / navy), all
 * copy read from the `home.homePage.tracking` namespace. The cards stay
 * server-rendered and are composed as children of the client `Carousel`, which
 * owns the scroll-snap + prev/next interactivity. Each card is sized to half
 * the carousel width (minus half the 24px gap) so exactly TWO full cards show
 * at once and the third scrolls in; on mobile each card is full-width.
 */
const CARDS = [
  { key: "math", surface: "primary" as const },
  { key: "english", surface: "secondary" as const },
  { key: "chemistry", surface: "primary" as const },
];

export async function TrackingSection() {
  const t = await getTranslations("home.homePage.tracking");

  return (
    <section className="flex w-full flex-col items-start gap-[60px]">
      <div className="flex w-full flex-col items-start gap-3 text-start">
        <h2 className="text-[36px] leading-[48px] font-semibold text-primary">
          {t("heading")}
        </h2>
        <p className="text-lg leading-7 font-medium text-secondary">
          {t("subheading")}
        </p>
      </div>
      <Carousel
        label={t("heading")}
        itemClassName="w-[calc(100%-24px)] sm:w-[calc(50%-12px)]"
      >
        {CARDS.map(({ key, surface }) => (
          <ProgressTrackingCard
            key={key}
            value={25}
            surface={surface}
            badgeLabel={t(`cards.${key}.badge`)}
            greeting={t(`cards.${key}.greeting`)}
            body={t(`cards.${key}.body`)}
            meta={{
              timeLeft: t(`cards.${key}.timeLeft`),
              lesson: t(`cards.${key}.lesson`),
              grade: t(`cards.${key}.grade`),
            }}
            ctaLabel={t(`cards.${key}.cta`)}
          />
        ))}
      </Carousel>
    </section>
  );
}
