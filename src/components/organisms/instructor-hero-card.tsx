import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Instructor Hero Card — Figma 856:5879 (+ hero image 856:5883).
 *
 * An instructor profile hero (~470px wide): a `next/image` portrait beside a
 * name (H4), role (body), optional bio, a row of secondary badges and a CTA.
 * Composes the Badge and Button atoms. `shadow-card` + `rounded-card-xl`.
 */
type InstructorHeroCardProps = React.ComponentProps<"article"> & {
  /** Portrait image source (local/placeholder — caller supplies). */
  imageSrc: string;
  /** Accessible alt text for the portrait. */
  imageAlt: string;
  /** Instructor name (H4). */
  name: React.ReactNode;
  /** Role / title line. */
  role?: React.ReactNode;
  /** Optional short bio. */
  bio?: React.ReactNode;
  /** Optional secondary badges (subjects, credentials). */
  badges?: string[];
  /** CTA label; falls back to i18n `organisms.instructor.cta`. */
  ctaLabel?: React.ReactNode;
  /** Optional CTA link target. */
  href?: string;
};

const InstructorHeroCard = React.forwardRef<
  HTMLElement,
  InstructorHeroCardProps
>(function InstructorHeroCard(
  {
    className,
    imageSrc,
    imageAlt,
    name,
    role,
    bio,
    badges,
    ctaLabel,
    href,
    ...props
  },
  ref,
) {
  const t = useTranslations("organisms");
  const headingId = React.useId();
  const cta = ctaLabel ?? t("instructor.cta");

  return (
    <article
      ref={ref}
      data-slot="instructor-hero-card"
      aria-labelledby={headingId}
      className={cn(
        "flex w-full flex-col items-center gap-6 rounded-card-xl border border-border bg-card p-8 text-start shadow-card sm:flex-row sm:items-start",
        className,
      )}
      {...props}
    >
      <div className="relative size-32 shrink-0 overflow-hidden rounded-card-xl bg-muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3
            id={headingId}
            className="text-[28px] leading-10 font-bold text-foreground"
          >
            {name}
          </h3>
          {role ? (
            <p className="text-body text-base leading-6">{role}</p>
          ) : null}
        </div>
        {bio ? <p className="text-body text-sm leading-5">{bio}</p> : null}
        {badges && badges.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <li key={index}>
                <Badge variant="primary" tone="light">
                  {badge}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-1">
          {href ? (
            <Button asChild>
              <a href={href}>{cta}</a>
            </Button>
          ) : (
            <Button type="button">{cta}</Button>
          )}
        </div>
      </div>
    </article>
  );
});

export { InstructorHeroCard };
