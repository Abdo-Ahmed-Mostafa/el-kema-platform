import { getTranslations } from "next-intl/server";

import { MediaInfoCard } from "@/components/organisms";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/shared";
import {
  StopwatchIcon,
  BookClosedIcon,
  PersonIcon,
  RightArrowIcon,
} from "@/components/icons";
import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";

/**
 * Home section 2 — "اكتشف الدورات التي تناسبك".
 *
 * A heading block plus a horizontal `Carousel` of `MediaInfoCard` organisms
 * (price row + rating badge) with prev/next controls beneath, matching the
 * Figma "التالي" button, then the existing "اكتشف اكثر" view-all CTA. The cards
 * stay server-rendered and are composed as children of the client carousel.
 * Copy + the per-card cover image come from the `home.homePage.courses`
 * namespace.
 */
const COURSES = [
  { key: "chemistry", image: "/home/course-3.png" },
  { key: "english", image: "/home/course-2.png" },
  { key: "math", image: "/home/course-1.png" },
];

export async function CoursesSection() {
  const t = await getTranslations("home.homePage.courses");

  return (
    <section className="flex w-full flex-col items-center gap-[60px]">
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
        controlsPlacement="below"
        itemClassName="w-full max-w-[410px]"
      >
        {COURSES.map(({ key, image }) => (
          <MediaInfoCard
            key={key}
            imageSrc={image}
            imageAlt={t(`items.${key}.imageAlt`)}
            title={t(`items.${key}.title`)}
            subtitle={t(`items.${key}.instructor`)}
            rating={t(`items.${key}.rating`)}
            meta={[
              {
                icon: <StopwatchIcon aria-hidden />,
                label: t("duration", { value: t(`items.${key}.duration`) }),
              },
              { icon: <BookClosedIcon aria-hidden />, label: t("grade") },
              {
                icon: <PersonIcon aria-hidden />,
                label: t("students", { value: t(`items.${key}.students`) }),
              },
            ]}
            price={{
              current: t(`items.${key}.price`),
              old: t(`items.${key}.oldPrice`),
              discountLabel: t("discount", {
                value: t(`items.${key}.discount`),
              }),
            }}
            ctaLabel={t("cta")}
          />
        ))}
      </Carousel>
      <Button asChild appearance="ghost" variant="primary" size="lg">
        <Link href={routes.courses}>
          {t("viewAll")}
          <RightArrowIcon aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
