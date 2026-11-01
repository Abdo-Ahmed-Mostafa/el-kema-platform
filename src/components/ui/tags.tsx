import * as React from "react";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

/**
 * Tag — Figma "Tags".
 * radius 8 (sm), padding 8, gap 8, border 1.
 *
 * States (Figma):
 * - Default: text/icon #a1a1aa, bg #f4f4f5, border #a1a1aa
 * - Hover: text/icon/border #123458, bg #eff5fa
 * - Pressed / selected: text/icon #fafafa, bg #123458, border #fafafa
 * - Disabled
 *
 * Selection is controllable via the `selected` prop and reflected to
 * `data-state` so consumers can style off it. An optional leading icon and a
 * removable close affordance are supported.
 */
const tagVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-2 rounded-sm border p-2 text-xs font-medium leading-tight transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:text-muted-foreground disabled:border-muted-foreground disabled:bg-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      selected: {
        true: "border-primary-foreground bg-primary text-primary-foreground",
        false:
          "border-muted-foreground bg-muted text-muted-foreground hover:border-primary hover:bg-primary-light hover:text-primary",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

type TagProps = Omit<React.ComponentProps<"button">, "children"> &
  Omit<VariantProps<typeof tagVariants>, "selected"> & {
    /** Controlled selected/pressed state (Figma "Pressed"). */
    selected?: boolean;
    /** Optional leading icon node. */
    icon?: React.ReactNode;
    /** Renders a trailing close affordance; fires when activated. */
    onRemove?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    /** Accessible label for the close affordance. */
    removeLabel?: string;
    children?: React.ReactNode;
  };

function Tag({
  className,
  selected = false,
  icon,
  onRemove,
  removeLabel = "Remove",
  children,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      data-slot="tag"
      data-state={selected ? "selected" : "default"}
      aria-pressed={selected}
      className={cn(tagVariants({ selected }), className)}
      {...props}
    >
      {icon}
      {children != null && <span>{children}</span>}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={removeLabel}
          data-slot="tag-remove"
          className="inline-flex shrink-0 items-center justify-center rounded-full outline-none hover:opacity-70"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(event);
          }}
        >
          <XIcon />
        </span>
      )}
    </button>
  );
}

export { Tag, tagVariants };
