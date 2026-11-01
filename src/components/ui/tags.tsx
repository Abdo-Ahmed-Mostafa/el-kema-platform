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
 *
 * a11y: the tag body and the remove control are sibling native
 * `<button>`s inside a non-interactive container, so neither is nested inside
 * the other. Both are tab-focusable and operable with Enter/Space, and each
 * shows a `focus-visible` ring using the ring token.
 */
const tagVariants = cva(
  "group inline-flex w-fit shrink-0 items-center gap-2 rounded-sm border p-2 text-xs font-medium leading-tight transition-colors has-[:disabled]:pointer-events-none has-[:disabled]:text-muted-foreground has-[:disabled]:border-muted-foreground has-[:disabled]:bg-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
    onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
  disabled,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-state={selected ? "selected" : "default"}
      className={cn(tagVariants({ selected }), className)}
    >
      <button
        type="button"
        data-slot="tag-body"
        data-state={selected ? "selected" : "default"}
        aria-pressed={selected}
        disabled={disabled}
        className="inline-flex items-center gap-2 bg-transparent outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:rounded-sm disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        {...props}
      >
        {icon}
        {children != null && <span>{children}</span>}
      </button>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          data-slot="tag-remove"
          disabled={disabled}
          className="inline-flex shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-70 focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(event);
          }}
        >
          <XIcon />
        </button>
      )}
    </span>
  );
}

export { Tag, tagVariants };
