import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

type DropdownLabeledProps = {
  /** Visible label text. */
  label: React.ReactNode;
  /** Id wired to the trigger and the Label's htmlFor. */
  id: string;
  /** Placeholder shown in the trigger when no value is selected. */
  placeholder?: string;
  /** Trigger size (pass-through to SelectTrigger). */
  size?: "sm" | "lg";
  /** Controlled value (pass-through to Select). */
  value?: string;
  /** Default value (pass-through to Select). */
  defaultValue?: string;
  /** Fires with the newly selected value (pass-through to Select). */
  onValueChange?: (value: string) => void;
  /** SelectItem children. */
  children?: React.ReactNode;
  /** Optional class for the wrapper. */
  className?: string;
};

/**
 * Dropdown Labeled — composes the Label atom with the Select atom in a
 * flex-col gap-2 wrapper. The Label's htmlFor is wired to the trigger id so
 * the control is programmatically labelled. No new styling is introduced.
 */
function DropdownLabeled({
  label,
  id,
  placeholder,
  size,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: DropdownLabeledProps) {
  return (
    <div
      data-slot="dropdown-labeled"
      className={cn("flex flex-col gap-2", className)}
    >
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        <SelectTrigger id={id} size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

export { DropdownLabeled };
