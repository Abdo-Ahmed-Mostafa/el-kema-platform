import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";

type TrustItem = {
  /** Optional logo/icon slot. */
  logo?: React.ReactNode;
  /** Visible label (brand/stat name). */
  label: string;
  /** Optional emphasised value (e.g. a stat number). */
  value?: React.ReactNode;
};

/**
 * Trust Section — Figma 843:5333.
 *
 * A `<section>` landmark holding a responsive row of trust items (logos or
 * stats). Title falls back to i18n `organisms.trust.title` and labels the
 * landmark via `aria-labelledby`. Logos are caller-supplied slots so no
 * Figma binaries are embedded.
 */
type TrustSectionProps = React.ComponentProps<"section"> & {
  /** Section heading; falls back to i18n. Pass `null` to hide it. */
  title?: React.ReactNode;
  /** Trust row items. */
  items: TrustItem[];
};

const TrustSection = React.forwardRef<HTMLElement, TrustSectionProps>(
  function TrustSection({ className, title, items, ...props }, ref) {
    const t = useTranslations("organisms");
    const headingId = React.useId();
    const heading = title === undefined ? t("trust.title") : title;

    return (
      <section
        ref={ref}
        data-slot="trust-section"
        aria-labelledby={heading != null ? headingId : undefined}
        className={cn("flex w-full flex-col gap-6", className)}
        {...props}
      >
        {heading != null ? (
          <h2
            id={headingId}
            className="text-center text-[20px] leading-8 font-medium text-foreground"
          >
            {heading}
          </h2>
        ) : null}
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-body [&_svg]:size-6"
            >
              {item.logo ? <span aria-hidden>{item.logo}</span> : null}
              {item.value != null ? (
                <span className="text-base leading-6 font-semibold text-foreground">
                  {item.value}
                </span>
              ) : null}
              <span className="text-sm leading-5">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  },
);

export { TrustSection };
export type { TrustItem };
