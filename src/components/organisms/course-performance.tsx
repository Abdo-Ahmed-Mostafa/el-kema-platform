import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { RateIcon, BookOpenedIcon } from "@/components/icons";

/**
 * Course Performance — Figma 1008:7826.
 *
 * A wide course KPI row: a revenue column, a completion-rate column with a
 * lightweight token-driven progress bar (no charting dependency), a students
 * column, and a trailing block with a rating (star), an optional Badge, the
 * course name and a secondary-light icon chip.
 *
 * Content is prop-driven; it composes the Badge atom and icon ReactNodes
 * without restyling them. The progress bar is a plain flex fill so it is
 * direction-agnostic; the layout otherwise uses logical properties.
 */
type CoursePerformanceProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Course name (paragraph-sm medium). */
  courseName: React.ReactNode;
  /** Revenue amount (already formatted by the caller). */
  revenue: React.ReactNode;
  /** Completion rate, 0–100. */
  completionRate: number;
  /** Students count. */
  students: React.ReactNode;
  /** Students-growth percentage (shown in secondary before the count). */
  studentsTrend?: React.ReactNode;
  /** Rating value (e.g. "4.8"). */
  rating?: React.ReactNode;
  /** Optional badge label shown by the rating. */
  badgeLabel?: React.ReactNode;
  /** Icon rendered inside the secondary-light chip. */
  icon?: React.ReactNode;
  /** Fallback label overrides. */
  revenueLabel?: React.ReactNode;
  completionLabel?: React.ReactNode;
  studentsLabel?: React.ReactNode;
};

const CoursePerformance = React.forwardRef<
  HTMLDivElement,
  CoursePerformanceProps
>(function CoursePerformance(
  {
    className,
    courseName,
    revenue,
    completionRate,
    students,
    studentsTrend,
    rating,
    badgeLabel,
    icon,
    revenueLabel,
    completionLabel,
    studentsLabel,
    ...props
  },
  ref,
) {
  const t = useTranslations("organisms");
  const headingId = React.useId();
  const clamped = Math.min(100, Math.max(0, completionRate));

  return (
    <div
      ref={ref}
      data-slot="course-performance"
      aria-labelledby={headingId}
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-6 rounded-lg border border-border bg-card p-6 text-start shadow-card",
        className,
      )}
      {...props}
    >
      {/* Revenue */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs leading-4 text-muted-foreground">
          {revenueLabel ?? t("dashboard.coursePerformance.revenue")}
        </span>
        <span className="text-base leading-6 font-medium text-primary">
          {revenue}
        </span>
      </div>

      {/* Completion rate */}
      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm leading-5 font-semibold text-primary">
            {clamped}%
          </span>
          <span className="flex-1 text-start text-xs leading-4 text-foreground">
            {completionLabel ?? t("dashboard.coursePerformance.completionRate")}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="presentation"
        >
          <div
            data-slot="course-performance-bar"
            className="h-full rounded-full bg-primary"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>

      {/* Students */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs leading-4 text-muted-foreground">
          {studentsLabel ?? t("dashboard.coursePerformance.students")}
        </span>
        <span className="flex items-center gap-1 text-base leading-6 font-medium text-primary">
          {studentsTrend != null ? (
            <span className="text-xs leading-4 text-secondary">
              {studentsTrend}
            </span>
          ) : null}
          {students}
        </span>
      </div>

      {/* Rating + badge + course name + icon chip */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            {rating != null ? (
              <span className="flex items-center gap-1 text-xs leading-4 font-medium text-warning">
                {rating}
                <RateIcon className="size-4" aria-hidden />
              </span>
            ) : null}
            {badgeLabel ? (
              <Badge variant="primary" tone="light">
                {badgeLabel}
              </Badge>
            ) : null}
          </div>
          <p
            id={headingId}
            className="text-base leading-6 font-medium text-primary"
          >
            {courseName}
          </p>
        </div>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-secondary-light text-secondary [&>svg]:size-5"
        >
          {icon ?? <BookOpenedIcon className="size-5" />}
        </span>
      </div>
    </div>
  );
});

export { CoursePerformance };
