import { getTranslations } from "next-intl/server";

import { FaqSection, type FaqItem } from "@/components/organisms";

/**
 * Home section 5 — "كل ما تريد معرفته عن El-Qimah Learn".
 *
 * A heading block plus a responsive 2-column grid where each column is a
 * `FaqSection` (title hidden) rendering three FAQ entries — six in total, to
 * match the Figma 2-column accordion grid. On small screens the columns stack.
 * Copy comes from `home.homePage.faq`.
 */
const LEFT_ITEMS = ["one", "two", "three"];
const RIGHT_ITEMS = ["four", "five", "six"];

export async function FaqSectionBlock() {
  const t = await getTranslations("home.homePage.faq");

  const toItems = (keys: string[]): FaqItem[] =>
    keys.map((key) => ({
      value: key,
      question: t(`items.${key}.question`),
      answer: t(`items.${key}.answer`),
    }));

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
      <div className="grid w-full items-start gap-6 lg:grid-cols-2">
        <FaqSection title={null} type="multiple" items={toItems(LEFT_ITEMS)} />
        <FaqSection title={null} type="multiple" items={toItems(RIGHT_ITEMS)} />
      </div>
    </section>
  );
}
