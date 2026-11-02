"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

/**
 * Selectable Card — a radio/checkbox-style selectable surface composed from
 * design tokens (mirrors the selected model of ui/tags.tsx).
 *
 * States (Figma):
 * - Default: text-muted-foreground, bg-muted, border-muted-foreground
 * - Hover: border-primary, bg-primary-light, text-primary
 * - Pressed / selected: text-primary, bg-card, border-primary
 * - Disabled
 *
 * Selection is controllable via `selected` and reflected to both
 * `aria-checked` and `data-state`. `role` defaults to "radio" (also accepts
 * "checkbox"). Enter/Space toggle selection. A leading icon slot is supported.
 */
const selectableCardVariants = cva(
  "group inline-flex w-full items-center gap-2 rounded-sm border px-4 py-2 text-start transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:text-muted-foreground disabled:border-muted-foreground disabled:bg-muted [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      selected: {
        true: "border-primary bg-card text-primary",
        false:
          "border-muted-foreground bg-muted text-muted-foreground hover:border-primary hover:bg-primary-light hover:text-primary",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

type SelectableCardProps = Omit<
  React.ComponentProps<"button">,
  "value" | "onChange"
> &
  Omit<VariantProps<typeof selectableCardVariants>, "selected"> & {
    /** Controlled selected/pressed state. */
    selected?: boolean;
    /** Optional value associated with this card. */
    value?: string;
    /** Optional leading icon node. */
    icon?: React.ReactNode;
    /** Primary heading text (text-sm font-medium). */
    heading?: React.ReactNode;
    /** Secondary subheading text (text-xs). */
    subheading?: React.ReactNode;
    /** ARIA role; defaults to "radio". */
    role?: "radio" | "checkbox";
    /** Fires when the card is toggled via click or keyboard. */
    onSelectedChange?: (selected: boolean) => void;
  };

const SelectableCard = React.forwardRef<HTMLButtonElement, SelectableCardProps>(
  (
    {
      className,
      selected = false,
      value,
      icon,
      heading,
      subheading,
      role = "radio",
      disabled,
      children,
      onSelectedChange,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const toggle = () => onSelectedChange?.(!selected);

    return (
      <button
        ref={ref}
        type="button"
        role={role}
        data-slot="selectable-card"
        data-state={selected ? "checked" : "unchecked"}
        aria-checked={selected}
        value={value}
        disabled={disabled}
        className={cn(selectableCardVariants({ selected }), className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        {...props}
      >
        {icon}
        {(heading != null || subheading != null) && (
          <span className="flex flex-col gap-0.5">
            {heading != null && (
              <span className="text-sm font-medium">{heading}</span>
            )}
            {subheading != null && (
              <span className="text-xs">{subheading}</span>
            )}
          </span>
        )}
        {children}
      </button>
    );
  },
);
SelectableCard.displayName = "SelectableCard";

export { SelectableCard, selectableCardVariants };
