"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/**
 * Accessible checkbox built on Radix.
 *
 * @example
 * // Pair with a Label for the Figma 8px gap + xsm label text:
 * <Label className="gap-2 text-sm">
 *   <Checkbox /> Accept terms
 * </Label>
 */
const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer size-4 shrink-0 rounded-[4px] border border-border bg-transparent outline-none transition-colors hover:border-primary hover:bg-primary-light focus-visible:ring-ring/50 focus-visible:ring-[3px] data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground disabled:cursor-not-allowed disabled:border-muted-foreground disabled:bg-muted disabled:text-muted-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      <Check className="size-3.5 text-primary-foreground" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
