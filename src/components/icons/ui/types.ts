import type * as React from "react";

/**
 * Shared props for hand-authored monochrome UI glyphs pulled from the El-Kema
 * Figma "Icons" frame (file key y0eOLyKLtTHnJYzOW046WR).
 *
 * These mirror the lucide icon API so they are drop-in replacements for the
 * semantic names previously backed by lucide-react: they inherit color via
 * `currentColor`, accept `className` and a numeric `size` (default 24), and
 * are decorative by default (`aria-hidden`) unless an `aria-label` is given.
 */
export interface UiIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  /** Rendered width and height in px. Defaults to 24. */
  size?: number;
}
