import type { UiIconProps } from "./types";

/**
 * Email glyph — El-Kema Figma node 73:4703 (envelope).
 * Monochrome, inherits `currentColor`. Backs the `EmailIcon` export used by
 * the login email field. Natural canvas is 100×100.
 */
export function EmailIcon({ size = 24, ...props }: UiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      <path
        fill="currentColor"
        d="M91.6667 25C91.6667 20.4167 87.9167 16.6667 83.3333 16.6667H16.6667C12.0833 16.6667 8.33333 20.4167 8.33333 25V75C8.33333 79.5833 12.0833 83.3333 16.6667 83.3333H83.3333C87.9167 83.3333 91.6667 79.5833 91.6667 75V25ZM83.3333 25L50 45.8333L16.6667 25H83.3333ZM83.3333 75H16.6667V33.3333L50 54.1667L83.3333 33.3333V75Z"
      />
    </svg>
  );
}
