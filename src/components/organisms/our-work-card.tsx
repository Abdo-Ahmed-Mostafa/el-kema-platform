import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Our Work Card — Figma 753:4774, states Default / Hover.
 *
 * A media card: a `next/image` cover, a secondary Badge tag, a paragraph-lg
 * title, body text and a ghost "read more" CTA. The hover appearance (a
 * medium 1.5px border) is driven BOTH by the `state` prop (so it is
 * controllable/testable) AND by real `:hover`/`focus-within`, so it responds
 * to pointer and keyboard focus. Uses the shared `shadow-card` token.
 */
const ourWorkCardVariants = cva(
  "group flex w-full flex-col overflow-hidden rounded-xl bg-card text-start shadow-card transition-colors focus-within:border-[1.5px] focus-within:border-border hover:border-[1.5px] hover:border-border",
  {
    variants: {
      state: {
        default: "border-[1.5px] border-transparent",
        hover: "border-[1.5px] border-border",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type OurWorkCardProps = Omit<React.ComponentProps<"article">, "title"> &
  VariantProps<typeof ourWorkCardVariants> & {
    /** Cover image source (local/placeholder — caller supplies). */
    imageSrc: string;
    /** Accessible alt text for the cover image. */
    imageAlt: string;
    /** Card title (paragraph-lg). */
    title: React.ReactNode;
    /** Card body copy. */
    body?: React.ReactNode;
    /** Optional secondary badge tag. */
    badgeLabel?: React.ReactNode;
    /** CTA label; falls back to i18n `organisms.ourWork.readMore`. */
    ctaLabel?: React.ReactNode;
    /** Optional link target for the CTA. */
    href?: string;
  };

const OurWorkCard = React.forwardRef<HTMLElement, OurWorkCardProps>(
  function OurWorkCard(
    {
      className,
      state = "default",
      imageSrc,
      imageAlt,
      title,
      body,
      badgeLabel,
      ctaLabel,
      href,
      ...props
    },
    ref,
  ) {
    const t = useTranslations("organisms");
    const headingId = React.useId();
    const cta = ctaLabel ?? t("ourWork.readMore");

    return (
      <article
        ref={ref}
        data-slot="our-work-card"
        data-state={state}
        aria-labelledby={headingId}
        className={cn(ourWorkCardVariants({ state }), className)}
        {...props}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 p-6">
          {badgeLabel ? (
            <Badge variant="secondary" tone="light" className="self-start">
              {badgeLabel}
            </Badge>
          ) : null}
          <h3
            id={headingId}
            className="text-[20px] leading-8 font-medium text-foreground"
          >
            {title}
          </h3>
          {body ? <p className="text-body text-sm leading-5">{body}</p> : null}
          <div className="mt-1">
            {href ? (
              <Button asChild appearance="ghost" size="sm" variant="primary">
                <a href={href}>{cta}</a>
              </Button>
            ) : (
              <Button
                type="button"
                appearance="ghost"
                size="sm"
                variant="primary"
              >
                {cta}
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  },
);

export { OurWorkCard, ourWorkCardVariants };
