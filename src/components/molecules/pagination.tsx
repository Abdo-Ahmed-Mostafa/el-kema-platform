"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";

type PaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  /** Current 1-based page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Fires with the requested 1-based page. */
  onPageChange?: (page: number) => void;
  /**
   * How many page numbers to show around the current page (each side) before
   * collapsing the rest behind an ellipsis. Defaults to 1.
   */
  siblingCount?: number;
};

const ELLIPSIS = "ellipsis";

/**
 * Build the page item list, collapsing long runs behind an ellipsis.
 * The first and last page are always shown, plus a window of `siblingCount`
 * pages on each side of the current page. Returns page numbers interleaved
 * with "ellipsis" markers.
 */
function buildPageItems(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | typeof ELLIPSIS)[] {
  if (pageCount <= 0) return [];
  // Show every page when the full set fits without collapsing.
  // 2 ends + 2 ellipses + current + 2*siblings is the threshold.
  const totalSlots = siblingCount * 2 + 5;
  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < pageCount - 1;

  const items: (number | typeof ELLIPSIS)[] = [1];
  if (showLeftEllipsis) items.push(ELLIPSIS);

  const start = showLeftEllipsis ? left : 2;
  const end = showRightEllipsis ? right : pageCount - 1;
  for (let p = start; p <= end; p++) items.push(p);

  if (showRightEllipsis) items.push(ELLIPSIS);
  items.push(pageCount);
  return items;
}

/**
 * Pagination — numbered page controls with Previous/Next affordances.
 *
 * Page items are size-10 rounded-full; the current page uses bg-primary /
 * text-primary-foreground. Prev/Next reuse the Button atom (ghost) and pick
 * the chevron by logical position — Previous sits inline-start, Next
 * inline-end — so the arrows flip correctly under RTL (never hardcode L/R).
 */
function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const t = useTranslations("molecules");

  const items = React.useMemo(
    () => buildPageItems(page, Math.max(0, pageCount), siblingCount),
    [page, pageCount, siblingCount],
  );

  const go = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return;
    onPageChange?.(next);
  };

  return (
    <nav
      data-slot="pagination"
      aria-label={t("pagination")}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Button
        appearance="ghost"
        size="icon"
        aria-label={t("previous")}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        {/* Logical inline-start arrow (flips under RTL). */}
        <LeftArrowIcon className="rtl:rotate-180" />
      </Button>
      <ul className="flex items-center gap-2">
        {items.map((item, index) => {
          if (item === ELLIPSIS) {
            return (
              <li
                key={`ellipsis-${index}`}
                data-slot="pagination-ellipsis"
                aria-hidden
                className="inline-flex size-10 items-center justify-center text-xs font-medium text-muted-foreground"
              >
                &#8230;
              </li>
            );
          }
          const isCurrent = item === page;
          return (
            <li key={item}>
              <button
                type="button"
                data-slot="pagination-item"
                aria-current={isCurrent ? "page" : undefined}
                aria-label={t("page", { page: item })}
                onClick={() => go(item)}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full text-xs font-medium transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  isCurrent
                    ? "border border-primary-hover bg-primary text-primary-foreground"
                    : "bg-card text-primary hover:bg-primary-light",
                )}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        appearance="ghost"
        size="icon"
        aria-label={t("next")}
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        {/* Logical inline-end arrow (flips under RTL). */}
        <RightArrowIcon className="rtl:rotate-180" />
      </Button>
    </nav>
  );
}

export { Pagination };
