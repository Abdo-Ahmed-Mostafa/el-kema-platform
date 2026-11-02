/**
 * Hand-authored monochrome UI glyphs — real SVGs extracted from the El-Kema
 * Figma "Icons" frame (file key y0eOLyKLtTHnJYzOW046WR). These replace the
 * earlier lucide approximations for the auth input glyphs so the built pages
 * match Figma 1:1. They inherit `currentColor` and accept `className` +
 * `size` (default 24), matching the lucide icon API so call sites are
 * unchanged. Import from "@/components/icons".
 */
export type { UiIconProps } from "./types";

export { PersonIcon } from "./person";
export { PhoneIcon } from "./phone";
export { CardIdIcon } from "./card-id";
export { EmailIcon } from "./email";
export { EyeIcon } from "./eye";
export { EyeClosedIcon } from "./eye-closed";
