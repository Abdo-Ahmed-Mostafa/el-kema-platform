"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { RightArrowIcon, LeftArrowIcon } from "@/components/icons";

/**
 * Carousel — a dependency-free horizontal scroller built on CSS scroll-snap.
 *
 * The scroll region is a flex row with `scroll-snap-type: x mandatory`; each
 * child becomes a snap item (`scroll-snap-align: start`). Native touch/trackpad
 * swipe works out of the box; the prev/next buttons call `scrollBy` with one
 * item's width (+ gap) in the direction derived from the live layout direction
 * (`dir`), never a hardcoded left/right, so it stays correct in RTL + LTR. The
 * buttons are real `<button>`s with aria-labels, and scrolling honours
 * `prefers-reduced-motion` by falling back to `behavior: "auto"`.
 *
 * The cards are passed as `children` so they stay server-rendered — this client
 * component only owns the scroll/controls interactivity.
 */
type CarouselProps = {
  /** The snap items (server-rendered cards). */
  children: React.ReactNode;
  /** Accessible label for the scroll region. */
  label?: string;
  /** Gap between items, in px. Matches the Figma section gap. */
  gap?: number;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Classes applied to each item wrapper (e.g. a fixed Figma width). */
  itemClassName?: string;
  /**
   * Where the prev/next controls sit. `"overlay"` pins them to the top-end
   * corner above the track; `"below"` centers them under the track (used by the
   * courses / instructors sections where Figma shows a button beneath).
   */
  controlsPlacement?: "overlay" | "below";
  /** Extra classes for the controls container. */
  controlsClassName?: string;
  /**
   * Whether to render the prev/next buttons. Swipe/scroll always works; set
   * this false when every item already fits on screen so the arrows aren't
   * shown with nothing to scroll to. Defaults to true.
   */
  showControls?: boolean;
};

/** Reads whether the browser currently prefers reduced motion. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Carousel({
  children,
  label,
  gap = 24,
  className,
  itemClassName,
  controlsPlacement = "overlay",
  controlsClassName,
  showControls = true,
}: CarouselProps) {
  const t = useTranslations("common");
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const items = React.Children.toArray(children);

  // Recompute the disabled state from the live scroll position. `scrollLeft` is
  // negative in RTL (and 0 at the logical start), so comparing against the
  // absolute distance keeps the maths direction-agnostic.
  const updateEdges = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const distance = Math.abs(el.scrollLeft);
    // 1px tolerance absorbs sub-pixel rounding at the extremes.
    setAtStart(distance <= 1);
    setAtEnd(max - distance <= 1);
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByItem = React.useCallback((towardsEnd: boolean) => {
    const el = scrollerRef.current;
    if (!el) return;

    // One item + gap. Fall back to a sensible fraction of the viewport if the
    // first child cannot be measured.
    const first = el.firstElementChild as HTMLElement | null;
    const style = window.getComputedStyle(el);
    const colGap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const step = first
      ? first.getBoundingClientRect().width + colGap
      : el.clientWidth * 0.8;

    // In RTL the content grows toward the logical start as `scrollLeft` goes
    // negative, so "towards the end" is a negative delta. Derive the sign from
    // the computed direction instead of hardcoding it.
    const isRtl = style.direction === "rtl";
    const signedStep = (towardsEnd ? step : -step) * (isRtl ? -1 : 1);

    el.scrollBy({
      left: signedStep,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const controls = (
    <div
      className={cn(
        "flex items-center gap-3",
        controlsPlacement === "below" ? "justify-center" : "justify-end",
        controlsClassName,
      )}
    >
      <Button
        type="button"
        appearance="outline"
        variant="primary"
        size="icon"
        aria-label={t("carouselPrevious")}
        disabled={atStart}
        onClick={() => scrollByItem(false)}
      >
        {/* The start-facing chevron points toward the inline start. */}
        <RightArrowIcon aria-hidden className="rtl:hidden" />
        <LeftArrowIcon aria-hidden className="hidden rtl:block" />
      </Button>
      <Button
        type="button"
        appearance="outline"
        variant="primary"
        size="icon"
        aria-label={t("carouselNext")}
        disabled={atEnd}
        onClick={() => scrollByItem(true)}
      >
        {/* The end-facing chevron points toward the inline end. */}
        <LeftArrowIcon aria-hidden className="rtl:hidden" />
        <RightArrowIcon aria-hidden className="hidden rtl:block" />
      </Button>
    </div>
  );

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {showControls && controlsPlacement === "overlay" ? controls : null}
      <div
        ref={scrollerRef}
        role="group"
        aria-label={label}
        className={cn(
          "flex w-full snap-x snap-mandatory scroll-smooth overflow-x-auto overscroll-x-contain",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "motion-reduce:scroll-auto",
        )}
        style={{ gap: `${gap}px` }}
      >
        {items.map((child, index) => (
          <div key={index} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      {showControls && controlsPlacement === "below" ? controls : null}
    </div>
  );
}

export { Carousel, type CarouselProps };
