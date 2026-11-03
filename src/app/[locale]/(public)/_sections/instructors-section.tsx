import { getTranslations } from "next-intl/server";

import { MediaInfoCard } from "@/components/organisms";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/shared";
import {
  LibraryIcon,
  BagIcon,
  PersonIcon,
  RightArrowIcon,
} from "@/components/icons";
import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";

/**
 * Home section 3 — "تعلّم على يد نخبة من المدرّسين".
 *
 * A heading block plus a horizontal `Carousel` of `MediaInfoCard` organisms
 * (rating badge, no price) with prev/next controls beneath, matching the Figma
 * "التالي" button, then the existing centered "اكتشف اكثر" CTA. The cards stay
 * server-rendered and are composed as children of the client carousel. Copy +
 * per-card cover image come from `home.homePage.instructors`.
 */
const INSTRUCTORS = [
  { key: "omar", image: "/home/course-3.png" },
  { key: "menna", image: "/home/course-2.png" },
  { key: "ahmed", image: "/home/course-1.png" },
];

export async function InstructorsSection() {
  const t = await getTranslations("home.homePage.instructors");

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
        {INSTRUCTORS.map(({ key, image }) => (
          <MediaInfoCard
            key={key}
            imageSrc={image}
            imageAlt={t(`items.${key}.imageAlt`)}
            title={t(`items.${key}.name`)}
            subtitle={t(`items.${key}.role`)}
            rating={t(`items.${key}.rating`)}
            meta={[
              {
                icon: <LibraryIcon aria-hidden />,
                label: t("courses", { value: t(`items.${key}.courses`) }),
              },
              {
                icon: <BagIcon aria-hidden />,
                label: t("experience", {
                  value: t(`items.${key}.experience`),
                }),
              },
              {
                icon: <PersonIcon aria-hidden />,
                label: t("students", { value: t(`items.${key}.students`) }),
              },
            ]}
            ctaLabel={t("cta")}
          />
        ))}
      </Carousel>
      <Button asChild appearance="ghost" variant="primary" size="lg">
        <Link href={routes.teachers}>
          {t("viewAll")}
          <RightArrowIcon aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
