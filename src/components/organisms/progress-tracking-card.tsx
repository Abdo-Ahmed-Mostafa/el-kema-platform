import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/molecules";
import {
  StopwatchIcon,
  BookOpenedIcon,
  LayersIcon,
  SigmaIcon,
} from "@/components/icons";

/**
 * Progress Tracking Card — Figma "Student Tracking Progress Card"
 * (nodes 696:8132 / 650:5511 / 629:3952).
 *
 * A wide gradient card that composes the `ProgressRing` molecule with a content
 * column: a filled Badge, a greeting (paragraph-lg), supporting body copy, a
 * meta row (time-left / lesson / grade) separated by dots, and an inverse
 * filled CTA. The `surface` prop swaps the gradient start color and the Badge
 * variant — navy ("primary") vs teal ("secondary"). The ring always renders in
 * its `inverse` state so it reads on the dark gradient.
 *
 * Presentational only (no i18n lookups); all copy is prop-driven so the thin
 * section wrapper owns the `home` namespace. Spacing uses logical utilities so
 * it stays correct in RTL + LTR.
 */
type ProgressTrackingMeta = {
  timeLeft: React.ReactNode;
  lesson: React.ReactNode;
  grade: React.ReactNode;
};

type ProgressTrackingCardProps = Omit<
  React.ComponentProps<"article">,
  "title"
> & {
  /** Progress value, 0–100. */
  value: number;
  /** Gradient + badge treatment. navy = "primary", teal = "secondary". */
  surface?: "primary" | "secondary";
  /** Badge label (e.g. the course name). */
  badgeLabel: React.ReactNode;
  /** Greeting line (paragraph-lg). */
  greeting: React.ReactNode;
  /** Supporting body copy. */
  body: React.ReactNode;
  /** The three meta items. */
  meta: ProgressTrackingMeta;
  /** CTA label. */
  ctaLabel: React.ReactNode;
  /** Optional CTA link target. */
  href?: string;
};

/** Gradient matches Figma angle 116.7deg: brand start → inverse dark stop. */
const SURFACE_GRADIENT: Record<
  NonNullable<ProgressTrackingCardProps["surface"]>,
  string
> = {
  primary:
    "linear-gradient(116.75deg, var(--primary) 0%, var(--foreground) 99%)",
  secondary:
    "linear-gradient(116.75deg, var(--secondary) 0%, var(--foreground) 99%)",
};

function Dot() {
  return (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full bg-primary-foreground/40"
    />
  );
}

function MetaItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1 text-primary-foreground [&_svg]:size-4">
      {icon}
      {label}
    </span>
  );
}

const ProgressTrackingCard = React.forwardRef<
  HTMLElement,
  ProgressTrackingCardProps
>(function ProgressTrackingCard(
  {
    className,
    value,
    surface = "primary",
    badgeLabel,
    greeting,
    body,
    meta,
    ctaLabel,
    href,
    ...props
  },
  ref,
) {
  const headingId = React.useId();
  const badgeVariant = surface === "secondary" ? "accent" : "primary";

  return (
    <article
      ref={ref}
      data-slot="progress-tracking-card"
      data-surface={surface}
      aria-labelledby={headingId}
      style={{ backgroundImage: SURFACE_GRADIENT[surface] }}
      className={cn(
        "flex w-full items-center gap-6 overflow-clip rounded-card-xl p-8 shadow-card",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col items-end gap-6 text-end">
        <div className="flex w-full flex-col items-end gap-5">
          <Badge variant={badgeVariant} tone="default">
            {badgeLabel}
            <SigmaIcon aria-hidden />
          </Badge>
          <p
            id={headingId}
            className="w-full text-[20px] leading-8 font-medium text-primary-foreground"
          >
            {greeting}
          </p>
          <p className="w-full text-sm leading-5 text-primary-foreground">
            {body}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 text-xs leading-4 font-medium">
            <MetaItem
              icon={<StopwatchIcon aria-hidden />}
              label={meta.timeLeft}
            />
            <Dot />
            <MetaItem
              icon={<BookOpenedIcon aria-hidden />}
              label={meta.lesson}
            />
            <Dot />
            <MetaItem icon={<LayersIcon aria-hidden />} label={meta.grade} />
          </div>
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
      <ProgressRing
        value={value}
        state="inverse"
        className="hidden size-[205px] shrink-0 sm:grid"
      />
    </article>
  );
});

export { ProgressTrackingCard };
export type { ProgressTrackingCardProps };
