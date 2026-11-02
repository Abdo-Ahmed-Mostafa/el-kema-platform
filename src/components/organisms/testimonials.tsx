import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RateIcon } from "@/components/icons";

/**
 * Testimonials — Figma 711:9325.
 *
 * A centered quote card: a circular Avatar, the reviewer name (paragraph-lg
 * semibold, primary), their role/description (muted), a star rating row and
 * the review body. The rating draws `rating` filled stars out of `maxRating`
 * using the RateIcon; it is exposed as an `img` with an accessible name so the
 * score is announced.
 *
 * Content is prop-driven; it composes the Avatar atom and RateIcon without
 * restyling them. The card is center-aligned and direction-agnostic.
 */
type TestimonialsProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Reviewer name. */
  name: React.ReactNode;
  /** Reviewer role / description. */
  role?: React.ReactNode;
  /** Quote / review body. */
  review: React.ReactNode;
  /** Avatar image source. */
  avatarSrc?: string;
  /** Avatar fallback (initials) when no image loads. */
  avatarFallback: React.ReactNode;
  /** Filled star count, 0–`maxRating`. */
  rating?: number;
  /** Total stars rendered. */
  maxRating?: number;
  /** Accessible rating label; falls back to "{rating} out of {max}". */
  ratingLabel?: string;
};

const Testimonials = React.forwardRef<HTMLElement, TestimonialsProps>(
  function Testimonials(
    {
      className,
      name,
      role,
      review,
      avatarSrc,
      avatarFallback,
      rating = 5,
      maxRating = 5,
      ratingLabel,
      ...props
    },
    ref,
  ) {
    const headingId = React.useId();
    const filled = Math.min(maxRating, Math.max(0, Math.round(rating)));
    const label = ratingLabel ?? `${filled} / ${maxRating}`;

    return (
      <article
        ref={ref}
        data-slot="testimonials"
        aria-labelledby={headingId}
        className={cn(
          "flex w-full max-w-[254px] flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center shadow-card",
          className,
        )}
        {...props}
      >
        <Avatar className="size-[100px]">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="text-[20px] leading-8 font-semibold text-primary">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-3 text-primary">
          <p id={headingId} className="text-[20px] leading-8 font-semibold">
            {name}
          </p>
          {role ? (
            <p className="text-xs leading-4 font-medium opacity-80">{role}</p>
          ) : null}
        </div>

        <div
          role="img"
          aria-label={label}
          className="flex items-center justify-center gap-1"
        >
          {Array.from({ length: maxRating }).map((_, index) => (
            <RateIcon
              key={index}
              aria-hidden
              className={cn(
                "size-5",
                index < filled
                  ? "fill-warning text-warning"
                  : "text-muted-foreground",
              )}
            />
          ))}
        </div>

        <p className="text-sm leading-5 text-primary">{review}</p>
      </article>
    );
  },
);

export { Testimonials };
