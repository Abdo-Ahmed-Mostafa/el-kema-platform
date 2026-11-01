import type * as React from "react";

/**
 * Shared props for hand-authored brand / payment / logo SVG marks.
 *
 * These are multi-color (or fixed-color) brand assets extracted from Figma, so
 * they do NOT inherit `currentColor` the way monochrome lucide icons do — the
 * brand colors are baked into the SVG. They still accept `className` and a
 * `size` (default 24), and are decorative by default (`aria-hidden`) unless a
 * `title` is supplied, which makes the mark meaningful to assistive tech.
 */
export interface BrandIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  "width" | "height"
> {
  /** Rendered width and height in px. Defaults to 24. */
  size?: number;
  /** Accessible name. When set, the icon is exposed to assistive tech
   *  (role="img" + <title>); otherwise it is hidden (aria-hidden). */
  title?: string;
}
