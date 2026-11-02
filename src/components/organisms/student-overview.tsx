import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { PersonIcon } from "@/components/icons";

/**
 * Student Overview — Figma 1174:24931, state Secondary.
 *
 * A compact student profile stat: a label (paragraph-sm medium, body) above a
 * large H4 Semibold value (primary), with a 32px icon chip at the block end.
 * The `tone` variant tints the chip (secondary by default, accent for an
 * alternate theme). Consumers stack several to build a stats grid.
 *
 * Content is prop-driven; it composes an icon ReactNode without restyling it.
 * Layout uses logical properties so it mirrors in RTL/LTR.
 */
const chipVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm [&>svg]:size-5",
  {
    variants: {
      tone: {
        secondary: "bg-secondary-light text-secondary",
        accent: "bg-accent-light text-accent",
        primary: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      tone: "secondary",
    },
  },
);

type StudentOverviewProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof chipVariants> & {
    /** Stat label (paragraph-sm medium). */
    label: React.ReactNode;
    /** Stat value (H4 Semibold, primary). */
    value: React.ReactNode;
    /** Icon rendered inside the chip; defaults to the person icon. */
    icon?: React.ReactNode;
  };

const StudentOverview = React.forwardRef<HTMLDivElement, StudentOverviewProps>(
  function StudentOverview(
    { className, tone = "secondary", label, value, icon, ...props },
    ref,
  ) {
    const labelId = React.useId();

    return (
      <div
        ref={ref}
        data-slot="student-overview"
        data-tone={tone}
        aria-labelledby={labelId}
        className={cn(
          "flex w-full items-start justify-between gap-3 rounded-lg border border-border bg-card p-6 text-start",
          className,
        )}
        {...props}
      >
        <div className="flex flex-1 flex-col gap-4">
          <p id={labelId} className="text-base leading-6 font-medium text-body">
            {label}
          </p>
          <p className="text-h4-semibold text-primary">{value}</p>
        </div>
        <span aria-hidden className={cn(chipVariants({ tone }))}>
          {icon ?? <PersonIcon className="size-5" />}
        </span>
      </div>
    );
  },
);

export { StudentOverview, chipVariants as studentOverviewVariants };
