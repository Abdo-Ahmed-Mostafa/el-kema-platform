/**
 * Central icon module for El-Kema — the single entry point for every icon in
 * the design system. Import from "@/components/icons".
 *
 * Two families live here:
 *  - Monochrome UI glyphs, re-exported from lucide-react under semantic,
 *    Figma-aligned names (see ./lucide). They inherit `currentColor` and take
 *    `className` + `size` (default 24).
 *  - Brand / payment / logo marks authored as real Figma SVGs (see ./brand).
 *    They keep their own brand colors and take `className` + `size` + `title`.
 *
 * Everything is a direct named re-export, so the module stays tree-shakeable:
 * importing one icon never pulls in the rest.
 */
export * from "./lucide";
export * from "./brand";
