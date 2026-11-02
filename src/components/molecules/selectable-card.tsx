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
 *
 * a11y: a lone `role="radio"` needs a radiogroup owner to be valid, so for the
 * common single-select case compose cards inside {@link SelectableCardGroup},
 * which supplies `role="radiogroup"`, roving tabindex and arrow-key movement.
 * For a standalone toggle (no group), pass `role="checkbox"`.
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

type SelectableCardOption = {
  value: string;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type SelectableCardGroupProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Accessible group name (role="radiogroup" + aria-label). */
  label: string;
  /** Cards to render. */
  options: SelectableCardOption[];
  /** Controlled selected value (single-select). */
  value?: string;
  /** Fires with the newly selected value. */
  onValueChange?: (value: string) => void;
};

/**
 * Selectable Card Group — the radiogroup owner for single-select selectable
 * cards. Supplies `role="radiogroup"`, a single roving tabstop and
 * inline-direction-aware arrow-key movement (ArrowRight/Left/Down/Up +
 * Home/End), which is what makes each child's `role="radio"` valid and
 * keyboard-complete. Selection is controlled via `value` / `onValueChange`.
 */
const SelectableCardGroup = React.forwardRef<
  HTMLDivElement,
  SelectableCardGroupProps
>(function SelectableCardGroup(
  { className, label, options, value, onValueChange, ...props },
  ref,
) {
  const groupRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => groupRef.current as HTMLDivElement);

  const selectableValues = options
    .filter((o) => !o.disabled)
    .map((o) => o.value);
  // The roving tabstop is the selected card, else the first enabled card.
  const activeValue =
    value && selectableValues.includes(value) ? value : selectableValues[0];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = [
      "ArrowRight",
      "ArrowLeft",
      "ArrowDown",
      "ArrowUp",
      "Home",
      "End",
    ];
    if (!keys.includes(event.key)) return;

    const group = groupRef.current;
    if (!group) return;
    const cards = Array.from(
      group.querySelectorAll<HTMLButtonElement>(
        '[data-slot="selectable-card"]:not(:disabled)',
      ),
    );
    if (cards.length === 0) return;

    const current = cards.indexOf(document.activeElement as HTMLButtonElement);
    const rtl = getComputedStyle(group).direction === "rtl";
    const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
    const backKey = rtl ? "ArrowRight" : "ArrowLeft";

    event.preventDefault();
    let nextIndex = current;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = cards.length - 1;
    } else if (event.key === forwardKey || event.key === "ArrowDown") {
      nextIndex = current < 0 ? 0 : (current + 1) % cards.length;
    } else if (event.key === backKey || event.key === "ArrowUp") {
      nextIndex =
        current < 0
          ? cards.length - 1
          : (current - 1 + cards.length) % cards.length;
    }
    const next = cards[nextIndex];
    if (next) {
      next.focus();
      // Radiogroup convention: moving focus selects.
      const nextValue = options.filter((o) => !o.disabled)[nextIndex]?.value;
      if (nextValue != null) onValueChange?.(nextValue);
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      data-slot="selectable-card-group"
      className={cn("flex flex-col gap-2", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {options.map((option) => (
        <SelectableCard
          key={option.value}
          role="radio"
          value={option.value}
          icon={option.icon}
          heading={option.heading}
          subheading={option.subheading}
          disabled={option.disabled}
          selected={value === option.value}
          tabIndex={option.disabled || option.value !== activeValue ? -1 : 0}
          onSelectedChange={(next) => {
            if (next) onValueChange?.(option.value);
          }}
        />
      ))}
    </div>
  );
});
SelectableCardGroup.displayName = "SelectableCardGroup";

export {
  SelectableCard,
  SelectableCardGroup,
  selectableCardVariants,
  type SelectableCardOption,
};
