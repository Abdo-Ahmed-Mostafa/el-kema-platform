"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils/cn";

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentProps<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] data-[state=checked]:bg-primary data-[state=checked]:border-primary-hover data-[state=unchecked]:bg-muted data-[state=unchecked]:border-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:border-muted-foreground",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block size-5 rounded-full bg-primary-foreground shadow transition-transform data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-[22px] rtl:data-[state=unchecked]:-translate-x-0.5 rtl:data-[state=checked]:-translate-x-[22px]",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export { Switch };
