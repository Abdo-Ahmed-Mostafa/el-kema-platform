import * as React from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Why Elqimah — Figma 739:2952, horizontal row (~336×86).
 *
 * A leading decorative icon tile followed by a title and subtitle. Uses the
 * icon-text gap (8px) and logical padding so it mirrors in RTL/LTR.
 */
type WhyElqimahProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Decorative leading icon. */
  icon?: React.ReactNode;
  /** Row title. */
  title: React.ReactNode;
  /** Supporting subtitle. */
  subtitle?: React.ReactNode;
};

const WhyElqimah = React.forwardRef<HTMLDivElement, WhyElqimahProps>(
  function WhyElqimah({ className, icon, title, subtitle, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="why-elqimah"
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-start",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary [&_svg]:size-6"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base leading-6 font-semibold text-foreground">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-body text-sm leading-5">{subtitle}</p>
          ) : null}
        </div>
      </div>
    );
  },
);

export { WhyElqimah };
