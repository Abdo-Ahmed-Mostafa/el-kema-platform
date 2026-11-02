import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RateIcon } from "@/components/icons";

/**
 * Media Info Card — Figma "Course Card" (624:3506/3507/3508) and "Instructor
 * Card" (656:7092/7134/7049). Both share one anatomy, so this single organism
 * serves both sections.
 *
 * A bordered vertical card: a `next/image` cover on top, a title + subtitle, a
 * wrap row of meta items separated by vertical dividers, an optional price row
 * (discount badge + strikethrough old price + current price), a full-width
 * outlined primary CTA, and an optional absolutely-positioned rating badge
 * pinned to the top-start corner.
 *
 * Presentational only; all copy is prop-driven. Spacing uses logical utilities
 * (start/ps/pe) so it reads correctly in RTL + LTR.
 */
type MediaInfoMeta = {
  /** Leading icon. */
  icon: React.ReactNode;
  /** Meta label. */
  label: React.ReactNode;
};

type MediaInfoPrice = {
  /** Current price. */
  current: React.ReactNode;
  /** Optional original price (rendered struck-through). */
  old?: React.ReactNode;
  /** Optional discount badge label. */
  discountLabel?: React.ReactNode;
};

type MediaInfoCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Cover image source. */
  imageSrc: string;
  /** Accessible alt text for the cover. */
  imageAlt: string;
  /** Card title (paragraph-lg semibold). */
  title: React.ReactNode;
  /** Card subtitle (paragraph-xsm). */
  subtitle: React.ReactNode;
  /** Meta items rendered with vertical dividers between them. */
  meta: MediaInfoMeta[];
  /** CTA label. */
  ctaLabel: React.ReactNode;
  /** Optional CTA link target. */
  href?: string;
  /** Optional rating value shown in the floating top-start badge. */
  rating?: React.ReactNode;
  /** Optional price row. */
  price?: MediaInfoPrice;
};

const MediaInfoCard = React.forwardRef<HTMLElement, MediaInfoCardProps>(
  function MediaInfoCard(
    {
      className,
      imageSrc,
      imageAlt,
      title,
      subtitle,
      meta,
      ctaLabel,
      href,
      rating,
      price,
      ...props
    },
    ref,
  ) {
    const headingId = React.useId();

    return (
      <article
        ref={ref}
        data-slot="media-info-card"
        aria-labelledby={headingId}
        className={cn(
          "relative flex w-full flex-col gap-6 rounded-card-xl border-[1.5px] border-border bg-card p-4 text-end shadow-card",
          className,
        )}
        {...props}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[18px] bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-end gap-5">
          <div className="flex w-full flex-col items-end gap-3">
            <h3
              id={headingId}
              className="w-full text-[20px] leading-8 font-semibold text-foreground"
            >
              {title}
            </h3>
            <p className="w-full text-sm leading-5 text-body">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {meta.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 ? (
                  <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
                ) : null}
                <span className="flex shrink-0 items-center gap-1 text-xs leading-4 font-medium text-secondary [&_svg]:size-4">
                  {item.icon}
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {price ? (
            <div className="flex w-full flex-wrap items-center justify-end gap-3">
              {price.discountLabel ? (
                <Badge variant="error" tone="light">
                  {price.discountLabel}
                </Badge>
              ) : null}
              {price.old ? (
                <span className="text-sm leading-5 font-medium text-muted-foreground line-through">
                  {price.old}
                </span>
              ) : null}
              <span className="text-[20px] leading-8 font-semibold text-foreground">
                {price.current}
              </span>
            </div>
          ) : null}
        </div>

        {href ? (
          <Button
            asChild
            appearance="outline"
            variant="primary"
            className="w-full"
          >
            <a href={href}>{ctaLabel}</a>
          </Button>
        ) : (
          <Button
            type="button"
            appearance="outline"
            variant="primary"
            className="w-full"
          >
            {ctaLabel}
          </Button>
        )}

        {rating != null ? (
          <Badge
            variant="primary"
            tone="default"
            className="absolute start-[30px] top-[30px]"
          >
            {rating}
            <RateIcon aria-hidden />
          </Badge>
        ) : null}
      </article>
    );
  },
);

export { MediaInfoCard };
export type { MediaInfoCardProps };
