import * as React from "react";
import { useTranslations } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckmarkIcon } from "@/components/icons";

/**
 * Plans Card — Figma 803:4431, states Default / Pro.
 *
 * Composes the Badge (plan tag), Button (CTA) and CheckmarkIcon (feature
 * rows) atoms; it never restyles them. Default is an outlined card on the
 * default surface with a muted price box and an outlined primary CTA. Pro is
 * the highlighted variant: a subtle navy→teal gradient surface, the
 * primary-light-strong stroke, the `shadow-card` drop shadow, accent feature
 * labels, primary-colored features and a filled primary CTA.
 *
 * All copy is prop-driven; `organisms.plans.*` supplies fallback labels.
 * Layout uses logical properties only so it mirrors cleanly in RTL/LTR.
 */
const plansCardVariants = cva(
  "flex h-full w-full flex-col justify-between overflow-hidden rounded-card-xl border-[1.5px] p-8 text-start",
  {
    variants: {
      state: {
        default: "bg-card border-border",
        pro: "border-primary-light-strong shadow-card bg-gradient-to-bl from-card via-secondary-light to-primary-light",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type PlansCardProps = Omit<React.ComponentProps<"article">, "title"> &
  VariantProps<typeof plansCardVariants> & {
    /** Plan title (H4). */
    title: React.ReactNode;
    /** Short supporting description. */
    description?: React.ReactNode;
    /** Formatted price string (caller formats currency/period). */
    price: React.ReactNode;
    /** Feature rows, each rendered with a leading checkmark. */
    features: string[];
    /** Optional pill badge label; omit to hide the badge. */
    badgeLabel?: React.ReactNode;
    /** Heading above the feature list; falls back to i18n. */
    featuresLabel?: React.ReactNode;
    /** CTA label; falls back to i18n `organisms.cta`. */
    ctaLabel?: React.ReactNode;
    /** Optional CTA href (renders the Button as a link). */
    ctaHref?: string;
    /** CTA click handler (button mode). */
    onCtaClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

const PlansCard = React.forwardRef<HTMLElement, PlansCardProps>(
  function PlansCard(
    {
      className,
      state = "default",
      title,
      description,
      price,
      features,
      badgeLabel,
      featuresLabel,
      ctaLabel,
      ctaHref,
      onCtaClick,
      ...props
    },
    ref,
  ) {
    const t = useTranslations("organisms");
    const isPro = state === "pro";
    const headingId = React.useId();

    const cta = ctaLabel ?? t("cta");
    const featuresHeading = featuresLabel ?? t("plans.features");

    return (
      <article
        ref={ref}
        data-slot="plans-card"
        data-state={state}
        aria-labelledby={headingId}
        className={cn(plansCardVariants({ state }), className)}
        {...props}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              {badgeLabel ? (
                <Badge variant="primary">{badgeLabel}</Badge>
              ) : null}
              <h4
                id={headingId}
                className="flex-1 text-[20px] leading-8 font-medium text-foreground"
              >
                {title}
              </h4>
            </div>
            {description ? (
              <p className="text-body text-sm leading-5">{description}</p>
            ) : null}
          </div>

          {/* Price box: muted surface (Default) / gradient (Pro). */}
          <div
            className={cn(
              "flex items-center rounded-md p-4",
              isPro
                ? "bg-gradient-to-l from-primary-light-strong to-secondary-light-strong"
                : "bg-muted",
            )}
          >
            <p
              className={cn(
                "flex-1 text-[28px] leading-10 font-bold",
                isPro ? "text-primary" : "text-secondary",
              )}
            >
              {price}
            </p>
          </div>

          <div className="bg-border h-px w-full" aria-hidden />

          <div className="flex flex-col gap-4">
            <p
              className={cn(
                "text-xs leading-4 font-semibold",
                isPro ? "text-accent" : "text-foreground",
              )}
            >
              {featuresHeading}
            </p>
            <ul className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm leading-5"
                >
                  <CheckmarkIcon
                    aria-hidden
                    className={cn(
                      "size-5 shrink-0",
                      isPro ? "text-primary" : "text-secondary",
                    )}
                  />
                  <span className={isPro ? "text-primary" : "text-body"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 w-full">
          {ctaHref ? (
            <Button
              asChild
              className="w-full"
              variant="primary"
              appearance={isPro ? "filled" : "outline"}
            >
              <a href={ctaHref}>{cta}</a>
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full"
              variant="primary"
              appearance={isPro ? "filled" : "outline"}
              onClick={onCtaClick}
            >
              {cta}
            </Button>
          )}
        </div>
      </article>
    );
  },
);

export { PlansCard, plansCardVariants };
