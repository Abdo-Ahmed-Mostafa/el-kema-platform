import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

/**
 * Why To Start Card — Figma 769:3074, states Default / Hover.
 *
 * A compact vertical icon + heading + text card (~194×206). The `icon` slot
 * accepts any node from `@/components/icons`; it sits in a rounded primary-
 * light tile and is marked decorative. The hover appearance (border + card
 * shadow lift) is driven by the `state` prop and real `:hover`/`focus-within`.
 */
const whyToStartCardVariants = cva(
  "flex w-full flex-col items-start gap-3 rounded-xl border bg-card p-6 text-start transition-shadow focus-within:border-primary-light-strong focus-within:shadow-card hover:border-primary-light-strong hover:shadow-card",
  {
    variants: {
      state: {
        default: "border-border",
        hover: "border-primary-light-strong shadow-card",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

type WhyToStartCardProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof whyToStartCardVariants> & {
    /** Decorative leading icon. */
    icon?: React.ReactNode;
    /** Card heading. */
    title: React.ReactNode;
    /** Supporting body text. */
    text?: React.ReactNode;
  };

const WhyToStartCard = React.forwardRef<HTMLDivElement, WhyToStartCardProps>(
  function WhyToStartCard(
    { className, state = "default", icon, title, text, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="why-to-start-card"
        data-state={state}
        className={cn(whyToStartCardVariants({ state }), className)}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-lg bg-primary-light text-primary [&_svg]:size-6"
          >
            {icon}
          </span>
        ) : null}
        <h3 className="text-base leading-6 font-semibold text-foreground">
          {title}
        </h3>
        {text ? <p className="text-body text-sm leading-5">{text}</p> : null}
      </div>
    );
  },
);

export { WhyToStartCard, whyToStartCardVariants };
