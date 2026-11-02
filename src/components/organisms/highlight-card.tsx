import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { StudentIcon, BookOpenedIcon } from "@/components/icons";

/**
 * Highlight Card — Figma 1016:8697, variants Students / Courses.
 *
 * A compact horizontal row: a 32px icon chip at the block start, then a value
 * (paragraph-lg) and a supporting label (text-body). The two variants differ
 * only by the default icon and chip accent — students uses the secondary
 * token family, courses the primary one. A caller-supplied `icon` overrides
 * the default.
 *
 * Content is prop-driven and composes an icon ReactNode without restyling it.
 * Layout uses logical properties so it mirrors in RTL/LTR.
 */
const highlightCardVariants = cva(
  "flex w-full items-center gap-3 rounded-lg border border-border bg-card p-6 text-start",
);

const highlightChipVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm text-primary-foreground [&>svg]:size-5",
  {
    variants: {
      variant: {
        students: "bg-secondary",
        courses: "bg-primary",
      },
    },
    defaultVariants: {
      variant: "students",
    },
  },
);

type HighlightCardProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof highlightChipVariants> & {
    /** Highlight value (paragraph-lg). */
    value: React.ReactNode;
    /** Supporting label (text-body). */
    label: React.ReactNode;
    /** Icon rendered inside the chip; defaults per variant. */
    icon?: React.ReactNode;
  };

const HighlightCard = React.forwardRef<HTMLDivElement, HighlightCardProps>(
  function HighlightCard(
    { className, variant = "students", value, label, icon, ...props },
    ref,
  ) {
    const labelId = React.useId();
    const defaultIcon =
      variant === "courses" ? (
        <BookOpenedIcon className="size-5" />
      ) : (
        <StudentIcon className="size-5" />
      );

    return (
      <div
        ref={ref}
        data-slot="highlight-card"
        data-variant={variant}
        aria-labelledby={labelId}
        className={cn(highlightCardVariants(), className)}
        {...props}
      >
        <span aria-hidden className={cn(highlightChipVariants({ variant }))}>
          {icon ?? defaultIcon}
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-lg leading-7 font-semibold text-foreground">
            {value}
          </p>
          <p id={labelId} className="text-body text-sm leading-5">
            {label}
          </p>
        </div>
      </div>
    );
  },
);

export { HighlightCard, highlightCardVariants };
