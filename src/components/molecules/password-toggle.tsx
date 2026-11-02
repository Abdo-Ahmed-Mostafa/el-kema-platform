"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeClosedIcon } from "@/components/icons";

type PasswordToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  "appearance" | "size" | "onToggle"
> & {
  /** Controlled visibility state (true = password shown as plain text). */
  visible: boolean;
  /** Fires when the toggle is activated. */
  onToggle: () => void;
};

/**
 * Password Toggle — a ghost icon Button that flips a password field between
 * masked and visible. The eye / eye-closed glyphs are the real Figma icons
 * re-exported from the icon barrel.
 *
 * It is meant to sit as a password Input's trailing affordance. The Input's
 * icon wrapper is `pointer-events-none`, so place this toggle with
 * `absolute end-0 ... pointer-events-auto` (or outside that wrapper) so it
 * stays clickable — e.g.:
 *
 *   <div className="relative">
 *     <Input type={type} endIcon={<span className="size-4" />} />
 *     <PasswordToggle
 *       visible={visible}
 *       onToggle={toggle}
 *       className="absolute inset-y-0 end-0 pointer-events-auto"
 *     />
 *   </div>
 *
 * The `usePasswordToggle` helper returns everything needed to wire that up.
 */
function PasswordToggle({
  className,
  visible,
  onToggle,
  ...props
}: PasswordToggleProps) {
  const t = useTranslations("molecules");

  return (
    <Button
      type="button"
      appearance="ghost"
      size="icon"
      data-slot="password-toggle"
      aria-pressed={visible}
      aria-label={visible ? t("hidePassword") : t("showPassword")}
      onClick={onToggle}
      className={cn(className)}
      {...props}
    >
      {visible ? <EyeClosedIcon /> : <EyeIcon />}
    </Button>
  );
}

/**
 * usePasswordToggle — controls a password field's visibility and returns the
 * input `type`, the current `visible` state, a `toggle` handler, and a ready
 * `button` element to drop in as the Input's trailing affordance.
 */
function usePasswordToggle(initial = false) {
  const [visible, setVisible] = React.useState(initial);
  const toggle = React.useCallback(() => setVisible((v) => !v), []);

  return {
    visible,
    toggle,
    type: visible ? ("text" as const) : ("password" as const),
    button: <PasswordToggle visible={visible} onToggle={toggle} />,
  };
}

export { PasswordToggle, usePasswordToggle };
