import * as React from "react";

import { cn } from "@/lib/utils/cn";

type TextAreaProps = React.ComponentProps<"textarea"> & {
  error?: boolean;
};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={error || undefined}
        className={cn(
          "flex min-h-[92px] w-full resize-y rounded-md border border-border bg-muted px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground transition-colors outline-none hover:border-primary hover:bg-primary-light focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        {...props}
      />
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
