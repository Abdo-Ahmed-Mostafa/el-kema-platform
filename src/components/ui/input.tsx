import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "flex w-full min-w-0 border border-border bg-muted text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground hover:border-primary hover:bg-primary-light focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-[34px] rounded-sm px-2 py-2 text-sm",
        md: "h-[46px] rounded-md px-3 py-3 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, error, startIcon, endIcon, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        aria-invalid={error || undefined}
        className={cn(
          inputVariants({ size }),
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

    return (
      <div className="relative w-full" data-slot="input-wrapper">
        {startIcon ? (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2 text-muted-foreground [&_svg]:size-4">
            {startIcon}
          </span>
        ) : null}
        {input}
        {endIcon ? (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2 text-muted-foreground [&_svg]:size-4">
            {endIcon}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
