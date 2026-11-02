"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";
import { buttonVariants } from "@/components/ui/button";

/**
 * Button Group — a segmented control built from the Button atom's tokens.
 *
 * The wrapper gives logical radius only to the end items
 * ([&>*:first-child]:rounded-s-md / last-child:rounded-e-md) and collapses the
 * shared border between items. Selection is controlled via `value` /
 * `onValueChange`; the active item renders pressed (data-state="on") using the
 * Button atom's active classes. role="group"; items are <button aria-pressed>.
 */
const buttonGroupVariants = cva(
  "inline-flex items-stretch [&>*:not(:first-child)]:-ms-px [&>*]:rounded-none [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-e-md",
);

type ButtonGroupItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type ButtonGroupProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  items: ButtonGroupItem[];
  /** Controlled active value. */
  value?: string;
  /** Fires with the newly selected value. */
  onValueChange?: (value: string) => void;
};

function ButtonGroup({
  className,
  items,
  value,
  onValueChange,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(buttonGroupVariants(), className)}
      {...props}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            data-slot="button-group-item"
            data-state={active ? "on" : "off"}
            aria-pressed={active}
            disabled={item.disabled}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              buttonVariants({
                variant: "primary",
                appearance: active ? "filled" : "outline",
                size: "md",
              }),
              active && "bg-primary-pressed border-primary-pressed",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export { ButtonGroup, buttonGroupVariants };
