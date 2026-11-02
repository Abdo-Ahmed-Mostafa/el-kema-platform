# Figma Design System Tokens — El-Kema (source of truth)

Source: Figma file `y0eOLyKLtTHnJYzOW046WR` ("Design System" page).
These are the EXACT values pulled from Figma variable definitions. Follow them precisely.

## Typography

- **Font family (primary):** `IBM Plex Sans Arabic` (replaces Cairo). Load `arabic` + `latin` subsets, weights 400/500/600/700, display swap. Expose as `--font-ibm-plex-arabic` and wire into Tailwind `--font-sans`.
- Weights used: Regular=400, Medium=500 (also Semibold 600 / Bold 700 for headings).
- Paragraph scale (size / line-height, letter-spacing 0):
  - `xxsm`: 12 / 16
  - `xsm`: 14 / 20
  - `sm`: 16 / 24

## Core brand palette (hex)

| Role               | Default   | Hover     | Pressed                       | Light/Subtle                                                     |
| ------------------ | --------- | --------- | ----------------------------- | ---------------------------------------------------------------- |
| Primary (navy)     | `#123458` | `#102f50` | `#0d2947`                     | light bg `#eff5fa`, pressed-light bg `#d9e6f2`, border `#102f50` |
| Secondary (teal)   | `#14b8a6` | `#12a596` | `#0f8f81`                     | light bg `#f0fdfa` / `#ccfbf1`, border `#12a596`                 |
| Accent (deep teal) | `#0f766e` | —         | —                             | light bg `#ccfbf1`                                               |
| Error (red)        | `#ef4444` | `#dc3d3d` | `#c33535` (darkest `#a52d2d`) | light bg `#fef2f2` / `#fee2e2`                                   |
| Warning (amber)    | `#df900a` | —         | —                             | light bg `#fef3c7`                                               |

Neutrals:

- Text default/strong: `#18181b`
- Muted/placeholder text & disabled fg: `#a1a1aa`
- Disabled bg / subtle surface: `#f4f4f5`
- Border default: `#e4e4e7`
- On-primary / inverse text: `#fafafa`
- Filled input accent bg: `#5688b8`

## Radius scale

- sm = 8px, md = 12px, lg = 16px, full = 9999px
- Existing project base `--radius` is 0.625rem (10px); align tokens so sm/md/lg map to 8/12/16px.

## Component token references (for atoms stage)

### Button (type × style × size × state)

- Text/icon on filled: `#fafafa` (inverse type uses `#123458`).
- Padding: SM x/y 8, MD x/y 12, LG x/y 16. Radius: SM 8, MD 12, LG 16. Gap 8. Border weight 1.
- Primary filled: bg `#123458` / border `#102f50`; hover bg `#102f50` border `#0d2947`; pressed bg `#0d2947` border `#0a2139`.
- Secondary filled: bg `#14b8a6` / border `#12a596`; hover bg `#12a596` border `#0f8f81`; pressed bg `#0f8f81` border `#0c766a`.
- Error filled: bg `#ef4444` / border `#dc3d3d`; hover bg `#dc3d3d` border `#c33535`; pressed bg `#c33535` border `#a52d2d`.
- Inverse filled: bg `#fafafa` text `#123458`; hover bg `#eff5fa`; pressed bg `#d9e6f2`.
- Disabled: text `#a1a1aa` bg `#f4f4f5` border `#a1a1aa`.
- Outlined (primary/secondary/error): transparent bg, text+border = the type color; hover adds light bg (`#eff5fa` / `#f0fdfa` / `#fef2f2`); pressed adds stronger light bg (`#d9e6f2` / `#ccfbf1` / `#fee2e2`).
- Transparent: text = type color, no border; hover/pressed add the same light backgrounds as outlined.
- Styles: Filled, Outlined, Transparent (3). Types: Primary, Secondary, Error, Inverse, Disabled. Sizes: Small, Medium, Large. States: Default, Hover, Pressed.

### Badge (pill, radius 9999, padding x12 y8, gap 4, border 1)

- Error: text/icon `#ef4444`, bg light `#fee2e2`.
- Primary default: bg `#123458`, text/icon `#fafafa`; light bg `#d9e6f2`.
- Inverse: bg `#fafafa`, text/icon `#123458`.
- Secondary default: bg `#14b8a6`, text `#fafafa`; light: text `#14b8a6` bg `#ccfbf180`.
- Accent default: bg `#0f766e`, text `#fafafa`; light: text `#0f766e` bg `#ccfbf1`.
- Warning default: bg `#df900a`, text `#fafafa`; light: text `#df900a` bg `#fef3c7`.

### Input Field

- Label text `#18181b`. Placeholder text/icon `#a1a1aa`. Supporting text `#14b8a6`; error text `#ef4444`.
- Default bg `#f4f4f5` border `#e4e4e7`. Hover: text/icon/border `#123458`, bg `#eff5fa`. Filled: bg `#5688b8` text/icon `#fafafa`.
- Padding SM x/y 8, MD y 12. Radius SM 8. Border 1. Gaps: placeholder 8, input field 12.
- Sizes: Small, Medium. States: Default, Hover, Filled.

### Checkbox (radius 4, padding 4, stroke 1, gap 8)

- Active: bg `#123458` border `#123458`, checkmark `#fafafa`, text `#123458`.
- Hover: text/border `#123458`, bg `#eff5fa`.
- Disabled: text/border `#a1a1aa`.

### Radio: states Active, Disabled (same palette as checkbox).

### Switch: radius full, surface primary `#123458`, border `#102f50`; off/disabled surface `#f4f4f5`, border/icon `#a1a1aa`, inverse icon `#fafafa`. States: On, Off.

### Tags (radius 8, padding 8, stroke 1, gap 8)

- Default: text/icon `#a1a1aa`, bg `#f4f4f5`, border `#a1a1aa`.
- Hover: text/icon/border `#123458`, bg `#eff5fa`.
- Pressed: text/icon `#fafafa`, bg `#123458`, border `#fafafa`.
- States: Default, Hover, Pressed, Disabled.

### Dropdown/Select (radius 8, padding x8, y large 12 / small 8, stroke 1, gap 8)

- Default: text/icon `#a1a1aa`, bg subtle `#f4f4f5`, border `#e4e4e7`.
- Hover: text/icon/border `#123458`, bg `#eff5fa`.
- Sizes: Large, Small. States: Default, Hover.

## Dark mode

Keep the existing `.dark` strategy (next-themes `class`). Derive dark variants by lifting lightness in oklch while preserving hue, consistent with the current globals.css approach. Brand hue for primary is navy (~hue 250 in oklch), secondary/accent teal (~hue 174–180), warning amber, error red ~27.

## Notes

- Tokens must be defined as CSS variables in `src/app/globals.css` `:root` + `.dark`, mapped through the `@theme inline` block so Tailwind utilities (`bg-primary`, `text-secondary`, etc.) work.
- Use oklch for the theme variables to stay consistent with the current file; the hex values above are the design targets — convert them to oklch accurately.
- RTL (Arabic) is the default direction; all components must work in both `dir=rtl` and `dir=ltr`.
