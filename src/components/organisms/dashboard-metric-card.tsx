import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { ChartIcon } from "@/components/icons";

/**
 * Dashboard Metric Card — Figma 965:5276, states Default / Hover.
 *
 * A compact stat card: a top row with an optional trend Badge
 * (secondary/light) and the metric label (paragraph-sm medium), followed by a
 * 32px navy icon chip (rounded-sm, bg-primary, inverse icon). The value row
 * below renders in the H4 Semibold accent style. `state` toggles the card
 * chrome: default keeps the subtle border, hover lifts it with the
 * primary-hover stroke and `shadow-card`.
 *
 * Content is prop-driven; it composes the Badge atom and an icon ReactNode
 * without restyling them. Layout uses logical properties so it mirrors in
 * RTL/LTR.
 */
const dashboardMetricCardVariants = cva(
  "flex w-full flex-col gap-6 rounded-lg border bg-card p-6 text-start transition-[color,box-shadow]",
  {
    variants: {
      state: {
        default: "border-border",
        hover: "border-primary-hover shadow-card",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type DashboardMetricCardProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof dashboardMetricCardVariants> & {
    /** Metric label (paragraph-sm medium). */
    label: React.ReactNode;
    /** Metric value (H4 Semibold, accent). */
    value: React.ReactNode;
    /** Optional trend text; shown in a secondary/light Badge. */
    trendLabel?: React.ReactNode;
    /** Icon rendered inside the navy chip; defaults to the chart icon. */
    icon?: React.ReactNode;
  };

const DashboardMetricCard = React.forwardRef<
  HTMLDivElement,
  DashboardMetricCardProps
>(function DashboardMetricCard(
  { className, state = "default", label, value, trendLabel, icon, ...props },
  ref,
) {
  const labelId = React.useId();

  return (
    <div
      ref={ref}
      data-slot="dashboard-metric-card"
      data-state={state}
      aria-labelledby={labelId}
      className={cn(dashboardMetricCardVariants({ state }), className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {trendLabel ? (
          <Badge variant="secondary" tone="light">
            {trendLabel}
          </Badge>
        ) : null}
        <div className="flex flex-1 items-center justify-between gap-3">
          <p
            id={labelId}
            className="flex-1 text-body text-base leading-6 font-medium"
          >
            {label}
          </p>
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground [&>svg]:size-5"
          >
            {icon ?? <ChartIcon className="size-5" />}
          </span>
        </div>
      </div>
      <p className="text-h4-semibold text-accent">{value}</p>
    </div>
  );
});

export { DashboardMetricCard, dashboardMetricCardVariants };
