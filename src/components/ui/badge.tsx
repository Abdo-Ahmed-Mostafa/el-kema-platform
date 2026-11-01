import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

/**
 * Badge — Figma "Badge" pill.
 * radius full, padding x12 y8, gap 4, border 1.
 * `variant` is the color type; `tone` is Default (filled) or Light.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium leading-tight transition-[color,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      // Color type (Figma: Primary / Secondary / Accent / Warning / Error / Inverse).
      variant: {
        primary: "",
        secondary: "",
        accent: "",
        warning: "",
        error: "",
        inverse: "",
      },
      // Fill style (Figma: Default = filled, Light = tinted).
      tone: {
        default: "",
        light: "",
      },
    },
    compoundVariants: [
      // --- Default (filled) ---
      {
        variant: "primary",
        tone: "default",
        class: "border-transparent bg-primary text-primary-foreground",
      },
      {
        variant: "secondary",
        tone: "default",
        class: "border-transparent bg-secondary text-secondary-foreground",
      },
      {
        variant: "accent",
        tone: "default",
        class: "border-transparent bg-accent text-accent-foreground",
      },
      {
        variant: "warning",
        tone: "default",
        class: "border-transparent bg-warning text-warning-foreground",
      },
      {
        variant: "error",
        tone: "default",
        class:
          "border-transparent bg-destructive-light-strong text-destructive",
      },
      {
        variant: "inverse",
        tone: "default",
        class: "border-transparent bg-primary-foreground text-primary",
      },
      // --- Light (tinted) ---
      {
        variant: "primary",
        tone: "light",
        class: "border-transparent bg-primary-light-strong text-primary",
      },
      {
        variant: "secondary",
        tone: "light",
        class: "border-transparent bg-secondary-light-strong/50 text-secondary",
      },
      {
        variant: "accent",
        tone: "light",
        class: "border-transparent bg-accent-light text-accent",
      },
      {
        variant: "warning",
        tone: "light",
        class: "border-transparent bg-warning-light text-warning",
      },
      {
        variant: "error",
        tone: "light",
        class:
          "border-transparent bg-destructive-light-strong text-destructive",
      },
      {
        variant: "inverse",
        tone: "light",
        class: "border-transparent bg-primary-foreground text-primary",
      },
    ],
    defaultVariants: {
      variant: "primary",
      tone: "default",
    },
  },
);

function Badge({
  className,
  variant,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
