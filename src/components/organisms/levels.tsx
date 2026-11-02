import * as React from "react";
import { useTranslations } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

/**
 * Levels — Figma 901:10148, states Default / Hover (~281×240); the "levels
 * details" slot is node 947:3942.
 *
 * A level card: a circular icon tile, a level label (paragraph-lg) and a CTA.
 * The hover state turns the surface primary with inverse text + an inverse
 * button (confirmed from the Figma payload); it is controllable via the
 * `state` prop and also reacts to real `:hover`/`focus-within`.
 */
const levelsVariants = cva(
  "group flex w-full flex-col items-center gap-4 rounded-card-xl border p-6 text-center shadow-card transition-colors hover:border-primary hover:bg-primary focus-within:border-primary focus-within:bg-primary",
  {
    variants: {
      state: {
        default: "border-border bg-card",
        hover: "border-primary bg-primary",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type LevelsProps = React.ComponentProps<"article"> &
  VariantProps<typeof levelsVariants> & {
    /** Level label (e.g. "Level 1"). */
    level: React.ReactNode;
    /** Decorative icon inside the circular tile. */
    icon?: React.ReactNode;
    /** CTA label; falls back to i18n `organisms.levels.start`. */
    ctaLabel?: React.ReactNode;
    /** Optional CTA link target. */
    href?: string;
    /** Optional details slot ("The Levels Details", 947:3942). */
    details?: React.ReactNode;
  };

const Levels = React.forwardRef<HTMLElement, LevelsProps>(function Levels(
  {
    className,
    state = "default",
    level,
    icon,
    ctaLabel,
    href,
    details,
    ...props
  },
  ref,
) {
  const t = useTranslations("organisms");
  const headingId = React.useId();
  const cta = ctaLabel ?? t("levels.start");
  const isHover = state === "hover";

  return (
    <article
      ref={ref}
      data-slot="levels"
      data-state={state}
      aria-labelledby={headingId}
      className={cn(levelsVariants({ state }), className)}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className={cn(
            "flex size-[60px] items-center justify-center rounded-full [&_svg]:size-7",
            "bg-primary-light text-primary group-hover:bg-primary-foreground group-focus-within:bg-primary-foreground",
            isHover && "bg-primary-foreground",
          )}
        >
          {icon}
        </span>
      ) : null}
      <h3
        id={headingId}
        className={cn(
          "text-[20px] leading-8 font-medium text-foreground group-hover:text-primary-foreground group-focus-within:text-primary-foreground",
          isHover && "text-primary-foreground",
        )}
      >
        {level}
      </h3>
      {details ? (
        <div
          className={cn(
            "text-body text-sm leading-5 group-hover:text-primary-foreground/80 group-focus-within:text-primary-foreground/80",
            isHover && "text-primary-foreground/80",
          )}
        >
          {details}
        </div>
      ) : null}
      <div className="mt-auto w-full">
        {href ? (
          <Button
            asChild
            className="w-full"
            variant={isHover ? "inverse" : "primary"}
          >
            <a href={href}>{cta}</a>
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full"
            variant={isHover ? "inverse" : "primary"}
          >
            {cta}
          </Button>
        )}
      </div>
    </article>
  );
});

export { Levels, levelsVariants };
