import { getTranslations } from "next-intl/server";

import { MediaInfoCard } from "@/components/organisms";
import { Button } from "@/components/ui/button";
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
 * A heading block plus a responsive 3-column grid of `MediaInfoCard` organisms
 * rendered with a price row and a rating badge. Copy + the per-card cover image
 * come from the `home.homePage.courses` namespace.
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
      <div className="flex w-full flex-col items-end gap-3 text-end">
        <h2 className="text-[36px] leading-[48px] font-semibold text-primary">
          {t("heading")}
        </h2>
        <p className="text-lg leading-7 font-medium text-secondary">
          {t("subheading")}
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
      <Button asChild appearance="ghost" variant="primary" size="lg">
        <Link href={routes.courses}>
          {t("viewAll")}
          <RightArrowIcon aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
