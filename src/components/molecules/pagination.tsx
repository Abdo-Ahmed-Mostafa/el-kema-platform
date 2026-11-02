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
};

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
  ...props
}: PaginationProps) {
  const t = useTranslations("molecules");

  const pages = React.useMemo(
    () => Array.from({ length: Math.max(0, pageCount) }, (_, i) => i + 1),
    [pageCount],
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
        {pages.map((p) => {
          const isCurrent = p === page;
          return (
            <li key={p}>
              <button
                type="button"
                data-slot="pagination-item"
                aria-current={isCurrent ? "page" : undefined}
                aria-label={t("page", { page: p })}
                onClick={() => go(p)}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full text-xs font-medium transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  isCurrent
                    ? "border border-primary-hover bg-primary text-primary-foreground"
                    : "bg-card text-primary hover:bg-primary-light",
                )}
              >
                {p}
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
