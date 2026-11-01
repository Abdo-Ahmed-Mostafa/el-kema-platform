import type { BrandIconProps } from "./types";

/**
 * Vodafone payment mark — El-Kema Figma node 1032:10378.
 * Single brand red (#E60000) on a transparent ground. Not `currentColor`.
 */
export function VodafoneIcon({ size = 24, title, ...props }: BrandIconProps) {
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
        d="M50 0C36.7392 0 24.0215 5.26784 14.6447 14.6447C5.26784 24.0215 0 36.7392 0 50C0 63.2608 5.26784 75.9785 14.6447 85.3553C24.0215 94.7322 36.7392 100 50 100C63.2608 100 75.9785 94.7322 85.3553 85.3553C94.7322 75.9785 100 63.2608 100 50C100 36.7392 94.7322 24.0215 85.3553 14.6447C75.9785 5.26784 63.2608 0 50 0ZM67.7083 4.66667C69.0417 4.66667 70.4167 4.79167 71.2917 5.08333C62.25 6.95833 55.0417 15.375 55.0833 25C55.0833 25.2083 55.0833 25.4583 55.125 25.7083C70.2917 29.4167 77.0833 38.5417 77.0833 51.1667C77.25 63.7917 67.25 77.6667 50.375 77.7083C36.75 77.75 22.5417 66.0833 22.4583 47.375C22.4167 35 29.1667 23.0833 37.6667 16.0417C46 9.125 57.375 4.70833 67.7083 4.66667Z"
        fill="#E60000"
      />
    </svg>
  );
}
