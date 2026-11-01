"use client";

import { useMediaQuery } from "./use-media-query";

/** Mobile breakpoint — matches Tailwind's `md` (768px) lower bound. */
const MOBILE_QUERY = "(max-width: 767px)";

/** Returns `true` on viewports narrower than the `md` breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
