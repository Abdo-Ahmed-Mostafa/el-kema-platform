# Review — Foundation: Design Tokens + Font (Figma adoption)

**Verdict: APPROVED**

Commit under review: `aa3bbdb` — "feat: adopt Figma design tokens (navy primary) and IBM Plex Sans Arabic font".
Scope reviewed: `src/app/globals.css`, `src/app/[locale]/layout.tsx`. Source of truth: `.agents/design-system/figma-tokens.md`.

## What was verified

### Brand primary is navy, not teal

`--primary` is now `oklch(0.321 0.075 252.4)` with `/* #123458 */`. Converted independently from `#123458` → `oklch(0.321 0.075 252.4)` — exact match. Ring, sidebar-primary, and sidebar-ring all point at the same navy value. The previous teal (`oklch(0.58 0.13 174)`) is fully replaced.

### Hex → oklch accuracy (all 24 tokens exact)

Reconstructed every implemented value from its Figma hex target using the standard sRGB→OKLab→OKLCH transform and compared against the committed values at the file's stated precision. Deltas were **0.000 on L, 0.000 on C, 0.0° on H for every token**:

- Primary scale: `#123458` / `#102f50` / `#0d2947` / `#eff5fa` (light) / `#d9e6f2` (light-strong).
- Secondary (teal): `#14b8a6` / `#12a596` / `#0f8f81` / `#f0fdfa` / `#ccfbf1`.
- Accent (deep teal): `#0f766e`, accent-light `#ccfbf1`.
- Warning (amber): `#df900a`, warning-light `#fef3c7`.
- Destructive (red): `#ef4444` / `#dc3d3d` / `#c33535` / `#fef2f2` / `#fee2e2`.
- Neutrals: foreground `#18181b`, muted-foreground `#a1a1aa`, muted `#f4f4f5`, border `#e4e4e7`, input filled `#5688b8`.

### Token scales present in :root and .dark

All scales (primary/secondary/accent/warning/destructive + hover/pressed/light/light-strong where the palette defines them) exist in `:root` and have `.dark` counterparts. Dark derivations lift lightness while preserving hue (navy ~252, teal ~182, deep teal ~186, amber ~70, red ~25), consistent with the figma-tokens.md dark-mode guidance.

### @theme mapping is additive; nothing removed

Compared the `--color-*` mappings between `HEAD~1` and `HEAD`: **no token was removed**, new ones (`-hover`, `-pressed`, `-light`, `-light-strong`, `warning*`, `accent-light`) were added. Existing Tailwind utilities (`bg-primary`, `text-secondary`, `bg-accent`, `border-border`, etc.) still resolve, so current component class usages keep compiling. The semantic recolor of `secondary`/`accent` (neutral-gray → teal) is the intended design change from Figma; foreground/background pairs were updated together, so no contrast pairing is broken.

### Radius scale

Base `--radius` unchanged at `0.625rem` (10px). `--radius-sm = calc(var(--radius) - 2px)` = 8px, `-md = +2px` = 12px, `-lg = +6px` = 16px, matching the 8/12/16 Figma scale. `-xl` kept at 20px.

### Font swap

`Cairo` → `IBM_Plex_Sans_Arabic` in `layout.tsx` with `subsets: ["arabic","latin"]`, `weight: ["400","500","600","700"]`, `display: "swap"`, `variable: "--font-ibm-plex-arabic"`. The `html` className uses `ibmPlexSansArabic.variable`. In `globals.css`, `--font-sans` now references `var(--font-ibm-plex-arabic)`. A repo-wide search for `cairo`/`Cairo`/`font-cairo`/`--font-cairo` found **no leftover source references** (only the explanatory "replaces Cairo" note in figma-tokens.md).

### Component APIs / RTL / dark mode

Diff touches only the two in-scope files — no component signatures or new components. `@custom-variant dark` and the `.dark` block are intact; RTL is unaffected (direction logic in `getDirection` untouched).

### Recorded verification (not re-run, per instructions)

Commit message records, from repo root: `npm run typecheck` → pass; `npm run lint` → 0 errors (1 pre-existing warning in `lint-staged.config.mjs`); `npm run build` → success (51 static pages); test suite not required (button test references no tokens). All three scripts exist in `package.json` (`tsc --noEmit`, `eslint`, `next build`). An invalid font export would hard-fail `next build`, so the passing build also corroborates the `IBM_Plex_Sans_Arabic` loader name.

## Findings

None. No reachable correctness, security, or data failures introduced; all values match the source of truth; changes are additive and non-breaking for existing utilities.
