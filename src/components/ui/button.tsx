import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground",
  {
    variants: {
      // Color type (Figma: Primary / Secondary / Error / Inverse).
      variant: {
        primary: "",
        secondary: "",
        destructive: "",
        inverse: "",
      },
      // Style (Figma: Filled / Outlined / Transparent).
      appearance: {
        filled: "border text-primary-foreground",
        outline: "border bg-transparent",
        ghost: "bg-transparent",
      },
      // Sizes (Figma: Small 8 / Medium 12 / Large 16 padding & radius).
      size: {
        sm: "h-[34px] rounded-sm px-2 py-2 text-sm",
        md: "h-[46px] rounded-md px-3 py-3 text-sm",
        lg: "h-[58px] rounded-lg px-4 py-4 text-sm",
        icon: "size-[46px] rounded-md",
      },
    },
    compoundVariants: [
      // --- Filled ---
      {
        variant: "primary",
        appearance: "filled",
        class:
          "bg-primary border-primary-hover hover:bg-primary-hover hover:border-primary-pressed active:bg-primary-pressed active:border-primary-pressed",
      },
      {
        variant: "secondary",
        appearance: "filled",
        class:
          "bg-secondary border-secondary-hover hover:bg-secondary-hover hover:border-secondary-pressed active:bg-secondary-pressed active:border-secondary-pressed",
      },
      {
        variant: "destructive",
        appearance: "filled",
        class:
          "bg-destructive border-destructive-hover hover:bg-destructive-hover hover:border-destructive-pressed active:bg-destructive-pressed active:border-destructive-pressed",
      },
      {
        variant: "inverse",
        appearance: "filled",
        class:
          "bg-primary-foreground border-primary-foreground text-primary hover:bg-primary-light active:bg-primary-light-strong",
      },
      // --- Outline ---
      {
        variant: "primary",
        appearance: "outline",
        class:
          "border-primary text-primary hover:bg-primary-light active:bg-primary-light-strong",
      },
      {
        variant: "secondary",
        appearance: "outline",
        class:
          "border-secondary text-secondary hover:bg-secondary-light active:bg-secondary-light-strong",
      },
      {
        variant: "destructive",
        appearance: "outline",
        class:
          "border-destructive text-destructive hover:bg-destructive-light active:bg-destructive-light-strong",
      },
      {
        variant: "inverse",
        appearance: "outline",
        class:
          "border-primary-foreground text-primary-foreground hover:bg-primary-light active:bg-primary-light-strong",
      },
      // --- Ghost (Transparent) ---
      {
        variant: "primary",
        appearance: "ghost",
        class:
          "text-primary hover:bg-primary-light active:bg-primary-light-strong",
      },
      {
        variant: "secondary",
        appearance: "ghost",
        class:
          "text-secondary hover:bg-secondary-light active:bg-secondary-light-strong",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        class:
          "text-destructive hover:bg-destructive-light active:bg-destructive-light-strong",
      },
      {
        variant: "inverse",
        appearance: "ghost",
        class:
          "text-primary-foreground hover:bg-primary-light active:bg-primary-light-strong",
      },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "filled",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  appearance,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, appearance, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
