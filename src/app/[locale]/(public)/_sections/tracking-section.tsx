import { getTranslations } from "next-intl/server";

import { ProgressTrackingCard } from "@/components/organisms";

/**
 * Home section 1 — "تابع تقدّمك في رحلتك التعليمية".
 *
 * A thin server-component wrapper: a heading block plus a responsive row of
 * three `ProgressTrackingCard` organisms (navy / teal / navy), all copy read
 * from the `home.homePage.tracking` namespace.
 */
const CARDS = [
  { key: "math", surface: "primary" as const },
  { key: "english", surface: "secondary" as const },
  { key: "chemistry", surface: "primary" as const },
];

export async function TrackingSection() {
  const t = await getTranslations("home.homePage.tracking");

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
      <div className="grid w-full gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </section>
  );
}
