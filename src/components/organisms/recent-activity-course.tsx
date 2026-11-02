import * as React from "react";
import { useTranslations } from "next-intl";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { RateIcon, PersonIcon, MoneyIcon } from "@/components/icons";

/**
 * Recent Activity Course — Figma 1089:15840, states 1 / 2.
 *
 * One component with a `variant` toggling the accent family: variant "1" is
 * the primary (navy) theme, variant "2" the accent (deep teal) theme. The card
 * carries a subtle gradient surface, a header row (Badge + course name), and
 * three labelled stat rows (rating / attendance / earnings), each with its
 * own value and a variant-colored icon chip.
 *
 * Content is prop-driven; it composes the Badge atom and icon ReactNodes
 * without restyling them. Layout uses logical properties so it mirrors in
 * RTL/LTR.
 */
const recentActivityCourseVariants = cva(
  "flex w-full flex-col gap-6 rounded-lg border p-6 text-start",
  {
    variants: {
      variant: {
        "1": "border-primary bg-gradient-to-bl from-primary-light to-card",
        "2": "border-accent bg-gradient-to-bl from-secondary-light to-card",
      },
    },
    defaultVariants: {
      variant: "1",
    },
  },
);

const chipVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm text-primary-foreground [&>svg]:size-5",
  {
    variants: {
      variant: {
        "1": "bg-primary",
        "2": "bg-accent",
      },
    },
    defaultVariants: {
      variant: "1",
    },
  },
);

type RecentActivityCourseProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof recentActivityCourseVariants> & {
    /** Course name (paragraph-lg medium). */
    courseName: React.ReactNode;
    /** Optional badge label by the course name. */
    badgeLabel?: React.ReactNode;
    /** Rating value. */
    rating: React.ReactNode;
    /** Students-present value. */
    attendance: React.ReactNode;
    /** Earnings value. */
    earnings: React.ReactNode;
    /** Label overrides; fall back to i18n. */
    ratingLabel?: React.ReactNode;
    attendanceLabel?: React.ReactNode;
    earningsLabel?: React.ReactNode;
    /** Icon overrides per stat row. */
    ratingIcon?: React.ReactNode;
    attendanceIcon?: React.ReactNode;
    earningsIcon?: React.ReactNode;
  };

const RecentActivityCourse = React.forwardRef<
  HTMLDivElement,
  RecentActivityCourseProps
>(function RecentActivityCourse(
  {
    className,
    variant = "1",
    courseName,
    badgeLabel,
    rating,
    attendance,
    earnings,
    ratingLabel,
    attendanceLabel,
    earningsLabel,
    ratingIcon,
    attendanceIcon,
    earningsIcon,
    ...props
  },
  ref,
) {
  const t = useTranslations("organisms");
  const headingId = React.useId();
  const badgeVariant = variant === "2" ? "accent" : "primary";

  const rows = [
    {
      key: "rating",
      label: ratingLabel ?? t("dashboard.recentActivityCourse.rating"),
      value: rating,
      icon: ratingIcon ?? <RateIcon className="size-5" />,
    },
    {
      key: "attendance",
      label: attendanceLabel ?? t("dashboard.recentActivityCourse.attendance"),
      value: attendance,
      icon: attendanceIcon ?? <PersonIcon className="size-5" />,
    },
    {
      key: "earnings",
      label: earningsLabel ?? t("dashboard.recentActivityCourse.earnings"),
      value: earnings,
      icon: earningsIcon ?? <MoneyIcon className="size-5" />,
    },
  ];

  return (
    <div
      ref={ref}
      data-slot="recent-activity-course"
      data-variant={variant}
      aria-labelledby={headingId}
      className={cn(recentActivityCourseVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {badgeLabel ? <Badge variant={badgeVariant}>{badgeLabel}</Badge> : null}
        <p
          id={headingId}
          className="flex-1 text-end text-[20px] leading-8 font-medium text-foreground"
        >
          {courseName}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1 text-end">
              <span className="text-xs leading-4 text-body">{row.label}</span>
              <span className="text-base leading-6 font-medium text-foreground">
                {row.value}
              </span>
            </div>
            <span aria-hidden className={cn(chipVariants({ variant }))}>
              {row.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export { RecentActivityCourse, recentActivityCourseVariants };
