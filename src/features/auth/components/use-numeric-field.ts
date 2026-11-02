import * as React from "react";
import type { UseFormSetValue, Path, FieldValues } from "react-hook-form";

/**
 * Props that make a text input accept digits only — as the user types AND on
 * paste — while staying accessible and RTL/LTR correct.
 *
 * Why not rely on the zod schema alone: schema validation runs on submit, so a
 * user could type letters into the phone / national-id fields and only learn
 * they are invalid after submitting. This restricts the field to digits at the
 * source: a controlled `onChange` strips every non-digit (covering typing,
 * paste, drag-drop and autofill in one place) and re-commits the cleaned value
 * through react-hook-form's `setValue`, so the form state can never hold a
 * non-digit. `inputMode="numeric"` brings up the numeric keypad on mobile and
 * `maxLength` caps the length; neither replaces the sanitiser.
 */
export function useNumericField<T extends FieldValues>(
  name: Path<T>,
  setValue: UseFormSetValue<T>,
  maxLength: number,
) {
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, "").slice(0, maxLength);
      setValue(name, digits as never, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [name, setValue, maxLength],
  );

  return {
    onChange,
    inputMode: "numeric" as const,
    pattern: "[0-9]*",
    maxLength,
  };
}
