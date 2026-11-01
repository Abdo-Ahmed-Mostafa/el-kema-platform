"use client";

import { useId } from "react";

import type { BrandIconProps } from "./types";

/**
 * Google sign-in mark — El-Kema Figma node 73:4738.
 * Multi-color brand mark built from solid fills plus three gradients. Not
 * `currentColor`. The gradient ids are made unique per render with `useId`
 * so multiple instances on one page never collide (hence a client component).
 */
export function GoogleIcon({ size = 24, title, ...props }: BrandIconProps) {
  const id = useId();
  const radial0 = `${id}-r0`;
  const radial1 = `${id}-r1`;
  const linear2 = `${id}-l2`;

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
        d="M98.0859 40.918H50.9961V60.2734H77.9102C76.7188 66.5039 73.1836 71.7773 67.8711 75.3125C63.418 78.3203 57.7344 80.1367 51.0156 80.1367C38.0078 80.1367 26.9727 71.3672 23.0078 59.5508H22.9492L23.0078 59.5117C22.0117 56.5039 21.4258 53.3203 21.4258 50.0195C21.4258 46.7188 22.0117 43.5156 23.0078 40.5273C26.9531 28.7109 38.0078 19.9414 51.0156 19.9414C58.3789 19.9414 64.9219 22.4805 70.1562 27.4023L84.4727 13.0859C75.7812 4.96094 64.4922 0 50.9961 0C31.4453 0 14.5898 11.2305 6.36719 27.5977C2.94922 34.3164 0.996094 41.9141 0.996094 50C0.996094 58.0859 2.94922 65.6836 6.36719 72.4023V72.4414C14.5898 88.7695 31.4453 100 50.9961 100C64.4922 100 75.8203 95.5469 84.082 87.9102C93.5352 79.1797 98.9844 66.3672 98.9844 51.1328C99.0039 47.5977 98.6914 44.1797 98.0859 40.918Z"
        fill="#FC4C53"
      />
      <path
        d="M23.0078 59.5508H22.9492L23.0078 59.5117C22.0117 56.5039 21.4258 53.3203 21.4258 50.0195C21.4258 46.6992 22.0117 43.5156 23.0078 40.5273C25.5078 33.0469 30.8594 26.8164 37.7148 23.2227C33.0078 16.9727 27.0117 12.5 20.3125 10.5859C14.5117 15.1367 9.70703 20.918 6.34766 27.5781C2.94922 34.3164 0.996094 41.9141 0.996094 50C0.996094 58.0859 2.94922 65.6836 6.36719 72.4023V72.4414C11.8945 83.3789 21.3086 92.0312 32.793 96.543C37.5977 92.1484 41.5234 86.1914 44.2383 79.2188C34.2969 76.7969 26.25 69.2383 23.0078 59.5508Z"
        fill={`url(#${radial0})`}
      />
      <path
        d="M6.73828 73.125C15.0781 89.082 31.7188 100 50.9961 100C64.4922 100 75.8203 95.5469 84.082 87.9102C93.5352 79.1797 98.9844 66.3672 98.9844 51.1328C98.9844 50.2539 98.9062 49.4336 98.8672 48.5742C87.3438 44.7852 74.1406 43.3594 60.3516 45.0781C57.1484 45.4688 54.0625 46.0742 51.0156 46.7773V60.2734H77.9297C76.7383 66.5039 73.2031 71.7773 67.8906 75.3125C63.4375 78.3203 57.7539 80.1367 51.0352 80.1367C38.0273 80.1367 26.9922 71.3672 23.0273 59.5508H22.9688L23.0273 59.5117C22.9297 59.2188 22.8906 58.9062 22.793 58.6133C16.4453 62.7734 11.0352 67.6953 6.73828 73.125Z"
        fill={`url(#${radial1})`}
      />
      <path
        d="M84.082 87.9102C93.5352 79.1797 98.9844 66.3672 98.9844 51.1328C98.9844 47.5781 98.6719 44.1797 98.0664 40.8984H50.9961V60.2539H77.9102C76.7188 66.4844 73.1836 71.7578 67.8711 75.293C64.668 77.4414 60.8203 78.9648 56.4258 79.6484L73.1641 95.2148C77.2266 93.3203 80.8984 90.8594 84.082 87.9102Z"
        fill={`url(#${linear2})`}
      />
      <defs>
        <radialGradient
          id={radial0}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(13.0291 57.1481) scale(35.2512 47.5839)"
        >
          <stop offset="0.368" stopColor="#FFCF09" />
          <stop offset="0.718" stopColor="#FFCF09" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFCF09" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={radial1}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(71.1067 -8.88159 -6.73813 -53.9644 67.0853 99.0396)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.383" stopColor="#34A853" />
          <stop offset="0.706" stopColor="#34A853" stopOpacity="0.7" />
          <stop offset="1" stopColor="#34A853" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={linear2}
          x1="101.836"
          y1="22.6433"
          x2="49.9701"
          y2="86.3386"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.671" stopColor="#4285F4" />
          <stop offset="0.885" stopColor="#4285F4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
