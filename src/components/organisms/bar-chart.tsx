import * as React from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Bar Chart — Figma 1042:12226.
 *
 * A generic, dependency-free vertical bar chart. Bars are flex columns; each
 * fill is a `rounded-sm` block whose height scales to `value / max` (clamped to
 * 0..100%). A value label sits above each bar (paragraph-xxsm medium) and a
 * category label below (`text-body` paragraph-xxsm). Optional y-axis tick
 * labels render along the block start. Card chrome matches
 * PlatformPerformance (rounded-lg + p-6 + shadow-card + border).
 *
 * a11y: the plot is wrapped with `role="img"` and an `aria-label` summary; a
 * visually-hidden list gives each bar an accessible name/value. Per-bar color
 * comes from the optional `color` DATA prop (used by presets such as
 * PaymentMethodChart) — the chart itself ships no brand colors.
 *
 * Content is prop-driven; layout uses logical properties so it mirrors in
 * RTL/LTR.
 */
type BarChartDatum = {
  /** Category label shown below the bar. */
  label: string;
  /** Bar value. */
  value: number;
  /** Optional CSS color for the bar fill (data, e.g. a brand hex). */
  color?: string;
};

type BarChartProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Bars, in display order. */
  data: BarChartDatum[];
  /** Optional card title (paragraph-sm medium, primary). */
  title?: React.ReactNode;
  /** Upper bound for scaling; defaults to the max data value. */
  max?: number;
  /** Optional explicit y-axis tick labels (top to bottom). */
  yTicks?: React.ReactNode[];
  /** Formats a value for the bar label + hidden summary. */
  formatValue?: (value: number) => string;
  /** Accessible summary of the chart; falls back to a generated label. */
  summary?: string;
};

function BarChart({
  className,
  data,
  title,
  max,
  yTicks,
  formatValue = (value) => String(value),
  summary,
  ...props
}: BarChartProps) {
  const titleId = React.useId();
  const computedMax =
    max ?? (data.length ? Math.max(...data.map((datum) => datum.value)) : 0);
  const safeMax = computedMax > 0 ? computedMax : 1;

  const ariaLabel =
    summary ??
    [
      typeof title === "string" ? title : undefined,
      data
        .map((datum) => `${datum.label} ${formatValue(datum.value)}`)
        .join(", "),
    ]
      .filter(Boolean)
      .join(": ");

  return (
    <div
      data-slot="bar-chart"
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        "flex w-full flex-col gap-6 rounded-lg border border-border bg-card p-6 text-start shadow-card",
        className,
      )}
      {...props}
    >
      {title ? (
        <p
          id={titleId}
          className="text-base leading-6 font-medium text-primary"
        >
          {title}
        </p>
      ) : null}

      <div className="flex items-stretch gap-3">
        {yTicks && yTicks.length ? (
          <div className="flex flex-col justify-between py-5 text-xs leading-4 text-body">
            {yTicks.map((tick, index) => (
              <span key={index}>{tick}</span>
            ))}
          </div>
        ) : null}

        <div role="img" aria-label={ariaLabel} className="flex-1">
          <div className="flex h-44 items-end justify-between gap-3">
            {data.map((datum) => {
              const pct = Math.min(
                100,
                Math.max(0, (datum.value / safeMax) * 100),
              );
              return (
                <div
                  key={datum.label}
                  data-slot="bar-chart-column"
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="flex w-full flex-col items-center gap-1">
                    <span className="text-xs leading-4 font-medium text-primary">
                      {formatValue(datum.value)}
                    </span>
                    <div
                      data-slot="bar-chart-bar"
                      className={cn(
                        "w-8 rounded-sm",
                        datum.color ? undefined : "bg-primary",
                      )}
                      style={{
                        height: `${pct}%`,
                        backgroundColor: datum.color,
                      }}
                    />
                  </div>
                  <span className="w-full text-center text-xs leading-4 text-body">
                    {datum.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {data.map((datum) => (
          <li key={datum.label}>
            {datum.label}: {formatValue(datum.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { BarChart, type BarChartDatum };
