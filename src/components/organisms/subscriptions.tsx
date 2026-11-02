import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { CartIcon } from "@/components/icons";

/**
 * Subscriptions — Figma 1049:12356, states Active / Expired / Cancelled.
 *
 * A status stat card whose surface, border, label and value colors all derive
 * from one `status` variant: active maps to the secondary token family,
 * expired to destructive (error), cancelled to warning. The header row pairs
 * the status label (paragraph-sm medium) with a 32px status-surface icon chip
 * (rounded-sm, inverse icon). The value row renders in the H4 Semibold style
 * in the matching status color.
 *
 * Content is prop-driven and composes an icon ReactNode without restyling it.
 * Layout uses logical properties so it mirrors in RTL/LTR.
 */
const subscriptionsVariants = cva(
  "flex w-full flex-col gap-6 rounded-lg border p-6 text-start",
  {
    variants: {
      status: {
        active: "bg-secondary-light border-secondary text-secondary",
        expired:
          "bg-destructive-light-strong border-destructive text-destructive",
        cancelled: "bg-warning-light border-warning text-warning",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

const chipVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-sm text-primary-foreground [&>svg]:size-5",
  {
    variants: {
      status: {
        active: "bg-secondary",
        expired: "bg-destructive",
        cancelled: "bg-warning",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

type SubscriptionsProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof subscriptionsVariants> & {
    /** Status label (paragraph-sm medium, status color). */
    label: React.ReactNode;
    /** Value (H4 Semibold, status color). */
    value: React.ReactNode;
    /** Icon rendered inside the status chip; defaults to the cart icon. */
    icon?: React.ReactNode;
  };

const Subscriptions = React.forwardRef<HTMLDivElement, SubscriptionsProps>(
  function Subscriptions(
    { className, status = "active", label, value, icon, ...props },
    ref,
  ) {
    const labelId = React.useId();

    return (
      <div
        ref={ref}
        data-slot="subscriptions"
        data-status={status}
        aria-labelledby={labelId}
        className={cn(subscriptionsVariants({ status }), className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-3">
          <p id={labelId} className="flex-1 text-base leading-6 font-medium">
            {label}
          </p>
          <span aria-hidden className={cn(chipVariants({ status }))}>
            {icon ?? <CartIcon className="size-5" />}
          </span>
        </div>
        <p className="text-h4-semibold">{value}</p>
      </div>
    );
  },
);

export { Subscriptions, subscriptionsVariants };
