import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { ChartIcon } from "@/components/icons";

/**
 * Platform Performance — Figma 979:6234, State = Revenue.
 *
 * A revenue/trend card: a header with an optional Badge (primary/light), the
 * title (paragraph-sm medium, primary) and a 32px navy icon chip; a body that
 * draws a self-contained, dependency-free responsive SVG line chart from the
 * `data: {label,value}[]` prop. Horizontal gridlines use `stroke-border`, the
 * trend line uses `stroke-primary` (or `stroke-secondary`), and the x-axis
 * month labels render in `text-body` paragraph-xxsm.
 *
 * a11y: the SVG is wrapped with `role="img"` and an `aria-label` text summary,
 * and the component also renders a visually-hidden textual summary describing
 * the series. No charting dependency is used — the polyline is computed here.
 *
 * Content is prop-driven and composes the Badge atom + an icon ReactNode
 * without restyling them. Layout uses logical properties so it mirrors in
 * RTL/LTR; the SVG coordinate space is numeric and direction-agnostic.
 */
type PlatformPerformancePoint = {
  /** x-axis category label (e.g. a month). */
  label: string;
  /** Numeric value plotted on the y-axis. */
  value: number;
};

type PlatformPerformanceProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Card title (paragraph-sm medium). */
  title: React.ReactNode;
  /** Series points, in display order. */
  data: PlatformPerformancePoint[];
  /** Optional badge label shown before the title. */
  badgeLabel?: React.ReactNode;
  /** Icon rendered inside the navy chip; defaults to the chart icon. */
  icon?: React.ReactNode;
  /** Line color accent. */
  tone?: "primary" | "secondary";
  /** Accessible summary of the chart; falls back to a generated label. */
  summary?: string;
  /** Formats a value for the hidden textual summary. */
  formatValue?: (value: number) => string;
};

const VIEW_W = 600;
const VIEW_H = 160;
const GRID_LINES = 5;

function PlatformPerformance({
  className,
  title,
  data,
  badgeLabel,
  icon,
  tone = "primary",
  summary,
  formatValue = (value) => String(value),
  ...props
}: PlatformPerformanceProps) {
  const titleId = React.useId();

  const values = data.map((point) => point.value);
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const span = max - min || 1;

  const points = data.map((point, index) => {
    const x =
      data.length > 1 ? (index / (data.length - 1)) * VIEW_W : VIEW_W / 2;
    const y = VIEW_H - ((point.value - min) / span) * VIEW_H;
    return { x, y, ...point };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  const firstLabel = data[0]?.label;
  const lastLabel = data[data.length - 1]?.label;
  const ariaLabel =
    summary ??
    (data.length
      ? `${typeof title === "string" ? title : ""} ${firstLabel}–${lastLabel}`.trim()
      : typeof title === "string"
        ? title
        : "");

  const strokeClass =
    tone === "secondary" ? "stroke-secondary" : "stroke-primary";
  const fillClass = tone === "secondary" ? "fill-secondary" : "fill-primary";

  return (
    <div
      data-slot="platform-performance"
      aria-labelledby={titleId}
      className={cn(
        "flex w-full flex-col gap-6 rounded-lg border border-border bg-card p-6 text-start shadow-card",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {badgeLabel ? (
          <Badge variant="primary" tone="light">
            {badgeLabel}
          </Badge>
        ) : null}
        <div className="flex flex-1 items-center justify-between gap-3">
          <p
            id={titleId}
            className="flex-1 text-base leading-6 font-medium text-primary"
          >
            {title}
          </p>
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground [&>svg]:size-5"
          >
            {icon ?? <ChartIcon className="size-5" />}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div role="img" aria-label={ariaLabel} className="w-full">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="h-40 w-full"
            aria-hidden
            focusable="false"
          >
            {Array.from({ length: GRID_LINES }).map((_, index) => {
              const y = (index / (GRID_LINES - 1)) * VIEW_H;
              return (
                <line
                  key={index}
                  x1={0}
                  x2={VIEW_W}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {points.length > 1 ? (
              <polyline
                points={polyline}
                fill="none"
                className={strokeClass}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            {points.map((point) => (
              <circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r={3}
                className={fillClass}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        <div className="flex items-center justify-between text-xs leading-4 text-body">
          {data.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
        <p className="sr-only">
          {data
            .map((point) => `${point.label}: ${formatValue(point.value)}`)
            .join(", ")}
        </p>
      </div>
    </div>
  );
}

export { PlatformPerformance, type PlatformPerformancePoint };
