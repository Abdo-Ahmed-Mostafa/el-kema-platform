"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Tag } from "@/components/ui/tags";

/**
 * Filter / Filter Group — Figma 1027:9355 / 995:7467.
 *
 * `Filter` is a single selectable chip that wraps the Tag atom, passing its
 * `selected` prop straight through to Tag's pressed state. The Tag atom is NOT
 * restyled — its native `<button aria-pressed>` body gives us a
 * keyboard-operable chip (Enter/Space) and the correct `aria-pressed`.
 *
 * `FilterGroup` is a labelled `role="group"` + `aria-label` set of Filter
 * chips with controlled `value` / `onValueChange`. It supports single-select
 * (value is a string, toggling off returns "") and multi-select (`multiple`,
 * value is a string[]). It reuses the ButtonGroup selection convention
 * (controlled value + per-item aria-pressed) without restyling that molecule.
 *
 * a11y: the group implements roving arrow-key focus — ArrowRight/ArrowLeft
 * (and Down/Up) move between chips, Home/End jump to the ends, and the arrows
 * honour RTL (inline-direction aware). Chips remain operable with Enter/Space
 * via the underlying Tag button. Copy is prop-driven; consumers pass labels.
 */
type FilterProps = Omit<React.ComponentProps<typeof Tag>, "children"> & {
  /** Pressed state, forwarded to the Tag atom. */
  selected?: boolean;
  /** Chip label. */
  children?: React.ReactNode;
};

function Filter({ selected = false, icon, children, ...props }: FilterProps) {
  return (
    <Tag data-slot="filter" selected={selected} icon={icon} {...props}>
      {children}
    </Tag>
  );
}

type FilterOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type SingleFilterGroupProps = {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
};

type MultiFilterGroupProps = {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

type FilterGroupProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Accessible group name (role="group" + aria-label). */
  label: string;
  /** Chips to render. */
  options: FilterOption[];
} & (SingleFilterGroupProps | MultiFilterGroupProps);

function FilterGroup({
  className,
  label,
  options,
  ...props
}: FilterGroupProps) {
  const { multiple, value, onValueChange, ...rest } =
    props as FilterGroupProps & {
      multiple?: boolean;
      value?: string | string[];
      onValueChange?: (value: string | string[]) => void;
    };

  const groupRef = React.useRef<HTMLDivElement>(null);

  const isSelected = (optionValue: string) =>
    multiple
      ? Array.isArray(value) && value.includes(optionValue)
      : value === optionValue;

  const handleToggle = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optionValue)
        ? current.filter((item) => item !== optionValue)
        : [...current, optionValue];
      (onValueChange as ((value: string[]) => void) | undefined)?.(next);
      return;
    }
    const next = value === optionValue ? "" : optionValue;
    (onValueChange as ((value: string) => void) | undefined)?.(next);
  };

  // Roving arrow-key focus across the chip buttons (inline-direction aware).
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
    // Each chip's focusable element is the Tag body <button aria-pressed>.
    const chips = Array.from(
      group.querySelectorAll<HTMLButtonElement>(
        "button[aria-pressed]:not(:disabled)",
      ),
    );
    if (chips.length === 0) return;

    const current = chips.indexOf(document.activeElement as HTMLButtonElement);
    const rtl = getComputedStyle(group).direction === "rtl";
    // In RTL the inline-forward arrow (ArrowRight) should move to the
    // previous chip, so forward/back flip with direction.
    const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
    const backKey = rtl ? "ArrowRight" : "ArrowLeft";

    event.preventDefault();
    let nextIndex = current;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = chips.length - 1;
    } else if (event.key === forwardKey || event.key === "ArrowDown") {
      nextIndex = current < 0 ? 0 : (current + 1) % chips.length;
    } else if (event.key === backKey || event.key === "ArrowUp") {
      nextIndex =
        current < 0
          ? chips.length - 1
          : (current - 1 + chips.length) % chips.length;
    }
    chips[nextIndex]?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      data-slot="filter-group"
      className={cn("flex flex-wrap items-center gap-2", className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {options.map((option) => (
        <Filter
          key={option.value}
          selected={isSelected(option.value)}
          icon={option.icon}
          disabled={option.disabled}
          onClick={() => handleToggle(option.value)}
        >
          {option.label}
        </Filter>
      ))}
    </div>
  );
}

export { Filter, FilterGroup, type FilterOption };
