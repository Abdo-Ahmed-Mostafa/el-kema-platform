import type { BrandIconProps } from "./types";

/**
 * Mastercard payment mark — El-Kema Figma node 1032:10412.
 * The interlocking red (#EB001B) / orange (#F79E1B) circles with their
 * overlap (#FF5A00). Not `currentColor` — the brand colors are fixed.
 */
export function MastercardIcon({ size = 24, title, ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M36.4258 25.6836H63.4961V74.2969H36.4258V25.6836Z"
        fill="#FF5A00"
      />
      <path
        d="M38.2227 50C38.2227 40.1172 42.8711 31.3477 50 25.6836C44.7461 21.5625 38.1445 19.0625 30.918 19.0625C13.8281 19.082 0 32.9102 0 50C0 67.0898 13.8281 80.918 30.918 80.918C38.125 80.918 44.7461 78.418 50 74.2969C42.8711 68.7305 38.2227 59.8828 38.2227 50Z"
        fill="#EB001B"
      />
      <path
        d="M100 50C100 67.0898 86.1719 80.918 69.082 80.918C61.875 80.918 55.2539 78.418 50 74.2969C57.207 68.6133 61.7773 59.8633 61.7773 49.9805C61.7773 40.0977 57.1289 31.3281 50 25.6641C55.2344 21.543 61.8555 19.043 69.0625 19.043C86.1719 19.082 100 32.9883 100 50Z"
        fill="#F79E1B"
      />
    </svg>
  );
}
