import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/**
 * Accessible loading spinner. Announced to screen readers via `role="status"`
 * and an sr-only label; the icon itself is hidden from the a11y tree.
 */
export function Spinner({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2Icon
        aria-hidden
        className={cn("text-muted-foreground size-5 animate-spin", className)}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
