import { type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Generic empty-state placeholder for lists/sections with no data.
 * Server-safe (no client hooks). Pass localized strings from the caller.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="text-muted-foreground [&_svg]:size-10" aria-hidden>
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground max-w-sm text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
