import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "@/components/icons";

/**
 * Offer Card — Figma "Suggestion" offer cards (679:7877 teal / 679:7648 gold).
 *
 * A wide gradient card with a bleeding illustration anchored to the end edge
 * and a content column aligned to the start: a filled Badge (with a Sparkles
 * glyph), a title (paragraph-lg), supporting body copy and an inverse filled
 * CTA. The `surface` prop swaps the gradient and the Badge variant — teal
 * ("teal" → accent badge) vs gold ("gold" → warning badge).
 *
 * Presentational only; all copy is prop-driven. The illustration is positioned
 * with logical offsets so it bleeds off the start edge in both RTL + LTR.
 */
type OfferCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** Gradient + badge treatment. */
  surface?: "teal" | "gold";
  /** Bleeding illustration source. */
  illustrationSrc: string;
  /** Accessible alt text for the illustration. */
  illustrationAlt: string;
  /** Badge label. */
  badgeLabel: React.ReactNode;
  /** Card title (paragraph-lg). */
  title: React.ReactNode;
  /** Supporting body copy. */
  body: React.ReactNode;
  /** CTA label. */
  ctaLabel: React.ReactNode;
  /** Optional CTA link target. */
  href?: string;
};

/** Gradient matches Figma angle 250.4deg: inverse dark → brand stop. */
const SURFACE_GRADIENT: Record<
  NonNullable<OfferCardProps["surface"]>,
  string
> = {
  teal: "linear-gradient(250.4deg, var(--foreground) 0%, var(--secondary) 100%)",
  gold: "linear-gradient(250.4deg, var(--foreground) 34%, var(--warning) 100%)",
};

const OfferCard = React.forwardRef<HTMLElement, OfferCardProps>(
  function OfferCard(
    {
      className,
      surface = "teal",
      illustrationSrc,
      illustrationAlt,
      badgeLabel,
      title,
      body,
      ctaLabel,
      href,
      ...props
    },
    ref,
  ) {
    const headingId = React.useId();
    const badgeVariant = surface === "gold" ? "warning" : "accent";

    return (
      <section
        ref={ref}
        data-slot="offer-card"
        data-surface={surface}
        aria-labelledby={headingId}
        style={{ backgroundImage: SURFACE_GRADIENT[surface] }}
        className={cn(
          "relative flex w-full items-center justify-start overflow-clip rounded-card-xl p-8",
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute bottom-0 end-[-40px] top-0 flex items-center">
          <Image
            src={illustrationSrc}
            alt={illustrationAlt}
            width={410}
            height={308}
            className="h-auto w-[300px] object-contain sm:w-[410px]"
          />
        </div>

        <div className="relative flex w-full max-w-[367px] flex-col items-start gap-6 text-start">
          <div className="flex w-full flex-col items-start gap-5">
            <Badge variant={badgeVariant} tone="default">
              {badgeLabel}
              <SparklesIcon aria-hidden />
            </Badge>
            <p
              id={headingId}
              className="w-full text-[20px] leading-8 font-medium text-primary-foreground"
            >
              {title}
            </p>
            <p className="w-full max-w-[225px] text-sm leading-5 text-primary-foreground">
              {body}
            </p>
          </div>
          {href ? (
            <Button
              asChild
              appearance="filled"
              variant="inverse"
              className="w-full max-w-[276px]"
            >
              <a href={href}>{ctaLabel}</a>
            </Button>
          ) : (
            <Button
              type="button"
              appearance="filled"
              variant="inverse"
              className="w-full max-w-[276px]"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </section>
    );
  },
);

export { OfferCard };
export type { OfferCardProps };
