import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";

/**
 * Project-wide `react-hook-form` wrapper.
 *
 * Bakes in the app's standard validation UX so every form behaves the same
 * without each call site repeating the config:
 *   - `mode: "onTouched"`      — a field's error first appears once it's been
 *                                touched (blurred) or the form is submitted.
 *   - `reValidateMode: "onChange"` — after an error is showing, it clears live
 *                                as the user types a valid value.
 *
 * Use this instead of calling `useForm` directly. Any option passed in still
 * overrides the defaults, so a form that needs different behavior can opt out.
 */
export function useAppForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
>(props?: UseFormProps<TFieldValues, TContext>) {
  return useForm<TFieldValues, TContext>({
    mode: "onTouched",
    reValidateMode: "onChange",
    ...props,
  });
}
