import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Accordion, AccordionItem } from "@/components/molecules";

type FaqItem = {
  /** Unique value identifying the item within the accordion. */
  value: string;
  /** The question / header content. */
  question: React.ReactNode;
  /** The answer / panel content. */
  answer: React.ReactNode;
};

/**
 * FAQ Section — Figma context 656:7297.
 *
 * A `<section>` landmark wrapping the stage-4A Accordion. It does NOT restyle
 * the accordion — it composes it, mapping `items` to `AccordionItem`s. The
 * heading labels the section via `aria-labelledby`; the title falls back to
 * i18n `organisms.faq.title`. This stays a server component: the Accordion
 * itself is the client boundary.
 */
type FaqSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** Section heading; falls back to i18n. Pass `null` to hide it. */
  title?: React.ReactNode;
  /** FAQ entries. */
  items: FaqItem[];
  /** Accordion behaviour — one open at a time or many. Defaults to "single". */
  type?: "single" | "multiple";
  /** Uncontrolled initial open value(s). */
  defaultValue?: string | string[];
};

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  function FaqSection(
    { className, title, items, type = "single", defaultValue, ...props },
    ref,
  ) {
    const t = useTranslations("organisms");
    const headingId = React.useId();
    const heading = title === undefined ? t("faq.title") : title;

    return (
      <section
        ref={ref}
        data-slot="faq-section"
        aria-labelledby={heading != null ? headingId : undefined}
        className={cn("flex w-full flex-col gap-6", className)}
        {...props}
      >
        {heading != null ? (
          <h2
            id={headingId}
            className="text-[28px] leading-10 font-bold text-foreground"
          >
            {heading}
          </h2>
        ) : null}
        <Accordion type={type} defaultValue={defaultValue}>
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              title={item.question}
            >
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    );
  },
);

export { FaqSection };
export type { FaqItem };
