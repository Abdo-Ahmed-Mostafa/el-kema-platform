import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "flex w-full min-w-0 border transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-[34px] rounded-sm px-2 py-2 text-sm",
        md: "h-[46px] rounded-md px-3 py-3 text-sm",
      },
      // Figma Input Field states: Default / Hover / Filled.
      state: {
        // Default resting surface; hover lifts to the primary-light tint.
        default:
          "border-border bg-muted text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground hover:border-primary hover:bg-primary-light",
        // Filled: accent surface (#5688b8 -> --input) with inverse text (#fafafa).
        filled:
          "border-input bg-input text-primary-foreground placeholder:text-primary-foreground/70 selection:bg-primary-foreground selection:text-primary",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
    /** Render the Figma "Filled" state (accent surface, inverse text). */
    filled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      state,
      error,
      filled,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    const resolvedState = state ?? (filled ? "filled" : "default");
    const input = (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        data-state={resolvedState}
        aria-invalid={error || undefined}
        className={cn(
          inputVariants({ size, state: resolvedState }),
          startIcon && "ps-9",
          endIcon && "pe-9",
          className,
        )}
        {...props}
      />
    );

    if (!startIcon && !endIcon) {
      return input;
    }

    const iconColor =
      resolvedState === "filled"
        ? "text-primary-foreground"
        : "text-muted-foreground";

    return (
      <div className="relative w-full" data-slot="input-wrapper">
        {startIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2 [&_svg]:size-4",
              iconColor,
            )}
          >
            {startIcon}
          </span>
        ) : null}
        {input}
        {endIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2 [&_svg]:size-4",
              iconColor,
            )}
          >
            {endIcon}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
