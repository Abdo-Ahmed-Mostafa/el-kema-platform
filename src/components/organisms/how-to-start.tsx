import * as React from "react";

import { cn } from "@/lib/utils/cn";

type HowToStartStep = {
  /** Step label. */
  label: React.ReactNode;
  /** Optional decorative icon shown inside the step marker. */
  icon?: React.ReactNode;
};

/**
 * How To Start — Figma 791:3459, a step indicator (~258×68).
 *
 * Rendered as an ordered list of step markers joined by border connectors
 * (no fetched SVG lines). The active step (`current`, 1-based) is marked with
 * `aria-current="step"` and a filled primary marker; connectors use logical
 * borders so the sequence flows correctly in RTL/LTR.
 */
type HowToStartProps = React.ComponentProps<"ol"> & {
  /** Ordered steps. */
  steps: HowToStartStep[];
  /** 1-based index of the active step. */
  current?: number;
};

const HowToStart = React.forwardRef<HTMLOListElement, HowToStartProps>(
  function HowToStart({ className, steps, current = 1, ...props }, ref) {
    return (
      <ol
        ref={ref}
        data-slot="how-to-start"
        className={cn("flex w-full items-center", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === current;
          const isComplete = stepNumber < current;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={index}
              aria-current={isActive ? "step" : undefined}
              className={cn("flex items-center gap-2", !isLast && "flex-1")}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm leading-5 font-semibold",
                    isActive || isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-body",
                  )}
                >
                  {step.icon ?? stepNumber}
                </span>
                <span
                  className={cn(
                    "text-sm leading-5",
                    isActive ? "font-semibold text-foreground" : "text-body",
                  )}
                >
                  {step.label}
                </span>
              </span>
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "mx-2 h-px flex-1 border-t",
                    isComplete ? "border-primary" : "border-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  },
);

export { HowToStart };
export type { HowToStartStep };
