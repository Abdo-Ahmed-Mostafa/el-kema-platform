"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";

/**
 * Progress Ring — an accessible circular progress indicator drawn with SVG.
 *
 * Geometry adapted from Figma node 640:4725: outer box 205×205, ring diameter
 * ~152. We draw inside a 152-unit viewBox (r = 68, strokeWidth = 12) and scale
 * the SVG to fill the 205px box. The track uses `stroke-muted`, the progress
 * arc `stroke-primary`, rounded caps, rotated -90° so it starts at the top.
 *
 * The visible value uses paragraph-lg (20/32) per figma-molecules.md — Figma's
 * H2 (48/60) was adapted down to the molecules doc's heading scale.
 *
 * Accessibility: wrapper is `role="progressbar"` with aria-valuenow/min/max and
 * an i18n accessible name ("{value}% complete"). The SVG is direction-agnostic,
 * so the component is RTL-safe without logical overrides.
 */

const RADIUS = 68;
const STROKE_WIDTH = 12;
const CENTER = 76; // (RADIUS + STROKE_WIDTH / 2) → fits the 152 box
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ProgressRingProps = React.ComponentProps<"div"> & {
  /** Progress value, 0–100. */
  value: number;
  /**
   * Visual state (Figma State=1 / State=2). "default" fills with the primary
   * color; "inverse" renders light-on-primary for use on dark surfaces.
   */
  state?: "default" | "inverse";
  /**
   * Whether to draw the static arc representing `value`. Defaults to true.
   * Set false to show only the track + the rotating loading spinner (used by
   * the home tracking cards, where the static arc read as a stray half-ring).
   */
  showValueArc?: boolean;
};

function ProgressRing({
  className,
  value,
  state = "default",
  showValueArc = true,
  ...props
}: ProgressRingProps) {
  const t = useTranslations("molecules");
  const clamped = Math.min(100, Math.max(0, value));
  const dashOffset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const inverse = state === "inverse";

  return (
    <div
      role="progressbar"
      data-slot="progress-ring"
      data-state={state}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("progress", { value: clamped })}
      className={cn("relative grid size-[205px] place-items-center", className)}
      {...props}
    >
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 152 152"
        fill="none"
        aria-hidden
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          className={inverse ? "stroke-primary-foreground/30" : "stroke-muted"}
        />
        {showValueArc ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={cn(
              "transition-[stroke-dashoffset] duration-300",
              inverse ? "stroke-primary-foreground" : "stroke-primary",
            )}
          />
        ) : null}
      </svg>
      {/* Decorative loading spinner — a short arc that slowly rotates around
          the ring. Purely decorative (aria-hidden); honours
          prefers-reduced-motion via motion-reduce:animate-none. A short dash
          (~12% of the circumference) reads as a moving indicator rather than a
          second full ring; the slow 6s duration keeps it calm. */}
      <svg
        aria-hidden
        className="absolute size-full -rotate-90 animate-spin [animation-duration:6s] motion-reduce:animate-none"
        viewBox="0 0 152 152"
        fill="none"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE * 0.12} ${CIRCUMFERENCE}`}
          className={inverse ? "stroke-primary-foreground" : "stroke-primary"}
        />
      </svg>
      <span
        aria-hidden
        className={cn(
          "absolute text-[20px] leading-8 font-semibold",
          inverse ? "text-primary-foreground" : "text-primary",
        )}
      >
        {clamped}%
      </span>
    </div>
  );
}

export { ProgressRing };
