import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { InfoIcon } from "@/components/icons";

/**
 * Activity Item — Figma 999:7499, states Secondary / Error / Warning.
 *
 * A single activity-feed row rendered as an <li> (consumers wrap a set in
 * <ul role="list">). A leading 12px status bar sits at the block start, then
 * a text block (name in paragraph-sm medium; a meta row combining the action
 * in the status color, a 4px separator dot and the time in muted foreground)
 * and finally a 32px icon chip in the status-LIGHT surface with a
 * status-colored icon.
 *
 * Every status color derives from one `status` variant. Content is
 * prop-driven and composes an icon ReactNode without restyling it. Layout
 * uses logical properties (start/end) so it mirrors in RTL/LTR.
 */
const activityItemVariants = cva(
  "flex items-center gap-3 border-b border-border px-6 py-6 text-start",
);

const dotVariants = cva("h-full min-h-6 w-3 shrink-0 self-stretch rounded-md", {
  variants: {
    status: {
      secondary: "bg-secondary",
      error: "bg-destructive",
      warning: "bg-warning",
    },
  },
  defaultVariants: {
    status: "secondary",
  },
});

const actionVariants = cva("text-xs leading-4", {
  variants: {
    status: {
      secondary: "text-secondary",
      error: "text-destructive",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    status: "secondary",
  },
});

const chipVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm [&>svg]:size-5",
  {
    variants: {
      status: {
        secondary: "bg-secondary-light text-secondary",
        error: "bg-destructive-light-strong text-destructive",
        warning: "bg-warning-light text-warning",
      },
    },
    defaultVariants: {
      status: "secondary",
    },
  },
);

type ActivityItemProps = Omit<React.ComponentProps<"li">, "children"> &
  VariantProps<typeof dotVariants> & {
    /** Activity name (paragraph-sm medium). */
    name: React.ReactNode;
    /** Action text, shown in the status color. */
    action?: React.ReactNode;
    /** Time text, shown in muted foreground. */
    time?: React.ReactNode;
    /** Icon rendered inside the status-light chip; defaults to the info icon. */
    icon?: React.ReactNode;
    /** Show the 4px separator dot between action and time. */
    showDot?: boolean;
  };

const ActivityItem = React.forwardRef<HTMLLIElement, ActivityItemProps>(
  function ActivityItem(
    {
      className,
      status = "secondary",
      name,
      action,
      time,
      icon,
      showDot = true,
      ...props
    },
    ref,
  ) {
    const hasMeta = action != null || time != null;

    return (
      <li
        ref={ref}
        data-slot="activity-item"
        data-status={status}
        className={cn(activityItemVariants(), className)}
        {...props}
      >
        <span aria-hidden className={cn(dotVariants({ status }))} />
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-base leading-6 font-medium text-primary">{name}</p>
          {hasMeta ? (
            <div className="flex items-center gap-2">
              {action != null ? (
                <span className={cn(actionVariants({ status }))}>{action}</span>
              ) : null}
              {action != null && time != null && showDot ? (
                <span
                  aria-hidden
                  className="size-1 shrink-0 rounded-full bg-muted-foreground"
                />
              ) : null}
              {time != null ? (
                <span className="text-xs leading-4 text-muted-foreground">
                  {time}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <span aria-hidden className={cn(chipVariants({ status }))}>
          {icon ?? <InfoIcon className="size-5" />}
        </span>
      </li>
    );
  },
);

export { ActivityItem, activityItemVariants };
