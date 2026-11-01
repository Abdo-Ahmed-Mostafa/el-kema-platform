import type { BrandIconProps } from "./types";

/**
 * Facebook sign-in mark — El-Kema Figma node 73:4751.
 * Two-tone brand mark: blue disc (#0866FF) with a white "f" glyph. Not
 * `currentColor` — the brand colors are fixed.
 */
export function FacebookIcon({ size = 24, title, ...props }: BrandIconProps) {
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
        d="M41.7578 99.4922C18.0078 95.2539 0 74.7461 0 50C0 22.5 22.5 0 50 0C77.5 0 100 22.5 100 50C100 74.7461 81.9922 95.2539 58.2422 99.4922L55.4883 97.2461H44.4922L41.7578 99.4922Z"
        fill="#0866FF"
      />
      <path
        d="M69.4922 64.0039L71.7383 50H58.4961V40.2539C58.4961 36.25 60 33.2617 65.9961 33.2617H72.5V20.5078C69.0039 20 65 19.5117 61.5039 19.5117C50 19.5117 42.0117 26.5039 42.0117 39.0039V50H29.5117V64.0039H42.0117V99.2578C44.7656 99.7656 47.5195 100 50.2539 100C53.0078 100 55.7617 99.7461 58.4961 99.2578V64.0039H69.4922Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
