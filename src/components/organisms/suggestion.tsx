import * as React from "react";
import { useTranslations } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

/**
 * Suggestion — Figma 685:8032, states First / Second (~628×258).
 *
 * A wide suggestion panel: a decorative icon, heading, body and a CTA. The
 * two states swap emphasis — "first" is a primary-light surface with a filled
 * CTA, "second" is the default surface with an outlined CTA. Uses
 * `shadow-card` and logical spacing.
 */
const suggestionVariants = cva(
  "flex w-full flex-col gap-4 rounded-card-xl border p-8 text-start shadow-card sm:flex-row sm:items-center",
  {
    variants: {
      state: {
        first: "border-primary-light-strong bg-primary-light",
        second: "border-border bg-card",
      },
    },
    defaultVariants: {
      state: "first",
    },
  },
);

type SuggestionProps = Omit<React.ComponentProps<"section">, "title"> &
  VariantProps<typeof suggestionVariants> & {
    /** Decorative leading icon. */
    icon?: React.ReactNode;
    /** Panel heading. */
    title: React.ReactNode;
    /** Supporting body copy. */
    body?: React.ReactNode;
    /** CTA label; falls back to i18n `organisms.suggestion.cta`. */
    ctaLabel?: React.ReactNode;
    /** Optional CTA link target. */
    href?: string;
  };

const Suggestion = React.forwardRef<HTMLElement, SuggestionProps>(
  function Suggestion(
    { className, state = "first", icon, title, body, ctaLabel, href, ...props },
    ref,
  ) {
    const t = useTranslations("organisms");
    const headingId = React.useId();
    const cta = ctaLabel ?? t("suggestion.cta");
    const isFirst = state === "first";

    return (
      <section
        ref={ref}
        data-slot="suggestion"
        data-state={state}
        aria-labelledby={headingId}
        className={cn(suggestionVariants({ state }), className)}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-card text-primary [&_svg]:size-7"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2
            id={headingId}
            className="text-[20px] leading-8 font-medium text-foreground"
          >
            {title}
          </h2>
          {body ? <p className="text-body text-sm leading-5">{body}</p> : null}
        </div>
        <div className="shrink-0">
          {href ? (
            <Button asChild appearance={isFirst ? "filled" : "outline"}>
              <a href={href}>{cta}</a>
            </Button>
          ) : (
            <Button type="button" appearance={isFirst ? "filled" : "outline"}>
              {cta}
            </Button>
          )}
        </div>
      </section>
    );
  },
);

export { Suggestion, suggestionVariants };
