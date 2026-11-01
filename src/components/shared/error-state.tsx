"use client";

import { AlertTriangleIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

/**
 * Generic error-state UI with an optional retry action. Used by `error.tsx`
 * boundaries (which pass `reset` as `onRetry`) and anywhere a recoverable
 * error should be shown. Strings are passed in so callers localize them.
 */
export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  className,
}: {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      <AlertTriangleIcon className="text-destructive size-10" aria-hidden />
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground max-w-sm text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {onRetry && retryLabel ? (
        <Button onClick={onRetry} appearance="outline">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
