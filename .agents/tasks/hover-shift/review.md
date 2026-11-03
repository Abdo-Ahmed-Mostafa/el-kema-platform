# Hover layout-shift fix on Home cards + FAQ

The change targets a perceived "text resize" when hovering course/instructor cards and FAQ rows on the Home page. The diagnosis lands on paint, not layout: box metrics were already constant across resting/hover, but `Button` carried `transition-all`, so the card CTA's outline→filled `group-hover` swap animated every property. As the navy fill animated in behind text flipping to white, glyphs were re-rasterized against a moving backdrop, reading as subtle breathing/resizing. The fix scopes the Button transition to color/background-color/border-color/box-shadow and pins `antialiased` on the two elements that flip white-on-navy (Button, accordion trigger). Two one-line edits, existing tokens, logical properties untouched.

Watch for: nothing blocking. The resting vs hover class sets differ only in color and shadow with identical geometry (confirmed), the outline→filled CTA keeps a constant 1px border and unchanged `md` padding in both states (confirmed), and the Button transition no longer animates any geometric property (confirmed).

**Verdict**: APPROVED

## High-level view

The root cause is correctly identified as glyph re-rasterization during a color transition rather than a box-metric change. No hover or group-hover class in the four in-scope files alters border-width, padding, font-size/weight, letter-spacing, line-height, or applies a transform — so there was never a real geometry delta to remove. The fix addresses the paint-level cause instead.

The Button base transition moved from `transition-all` to `transition-[color,background-color,border-color,box-shadow]`. This is the load-bearing edit: it guarantees that even if a future variant introduced a geometric hover class, the base transition cannot animate it, and it stops the fill from being animated as part of an all-property transition. Pairing it with `antialiased` fixes the smoothing mode so it stays backdrop-independent through the fill swap.

On the card CTA swap, `appearance="outline"` and `appearance="filled"` both carry `border` (1px), so promoting outline→filled via group-hover changes only border-color, background-color, and text color — never border width. Padding comes from the `size` variant and is not touched on hover. The card `<article>` already used a constant `border-[1.5px]` with a color/border/shadow-scoped transition, and the accordion trigger already had constant padding and type with a `transition-colors`; the badge has no hover state at all. The Figma hover look (card shadow lift + border-primary, CTA filled navy, FAQ navy hover) is preserved, and both edits are theme-agnostic so light and dark are unaffected.

<details>
<summary>Issues (1)</summary>

1. **Redundant hover + group-hover on card CTA** (informational, pre-existing) — the card CTA lists both `hover:{border-primary-hover,bg-primary,text-primary-foreground}` and the `group-hover:` equivalents. Both only change color, so this is not a layout-shift concern; it predates this commit and is out of scope. No action required.

</details>

<details>
<summary>Details</summary>

### Diagnosis: paint, not layout

The documented root cause holds up against the code. Walking the four in-scope files, nothing in a hover or group-hover state changes a geometric property: the card uses a constant `border-[1.5px]`; the Button outline and filled appearances both include `border` (1px); the accordion trigger keeps `px-4 py-4 text-[20px] leading-8 font-medium` across states; the badge has no hover classes. With geometry constant, the only remaining explanation for a perceived resize is sub-pixel rendering — glyphs re-rasterized against the navy fill as it animated in. That is the cause the fix removes.

### The load-bearing edit: scoping the Button transition

```
- transition-all
+ antialiased transition-[color,background-color,border-color,box-shadow]
```

`transition-all` would transition every animatable property, so when the CTA flips `bg-transparent → bg-primary` on group-hover, the fill animates in over the transition window while `color` flips to white. Scoping the transition to the four color/shadow properties keeps the exact hover look (all four are color/shadow props) while structurally guaranteeing no geometric property can ever animate from the base class — a stronger guarantee than just confirming today's variants are geometry-neutral. The `antialiased` addition pins grayscale smoothing so it does not switch modes against the changing backdrop, which is the direct fix for the re-raster. This matches the global `antialiased` already set on `<html>`.

### Resting vs hover class sets for the CTA

Resting (outline/primary): `border` (1px) + `border-primary` + `text-primary` + `bg-transparent`.
Hover (group-hover adds): `border-primary-hover` + `bg-primary` + `text-primary-foreground`.

Border width `border` (1px) is present in both outline and filled appearances, so the outline→filled promotion never changes width. Padding and height come from the default `size: md` (`h-[46px] px-3 py-3`) and are not referenced by any hover class. The delta between states is purely border-color, background-color, and text-color. Identical box metrics confirmed.

### Accordion trigger

The trigger gains only `antialiased`. Its hover state flips `bg-primary` + `text-primary-foreground` with a `transition-colors` (color-scoped already), over constant `px-4 py-4 text-[20px] leading-8 font-medium`. The same white-on-navy flip as the CTA, so the same smoothing stabilization applies. Geometry constant.

### Verification record

The commit message records, against the committed state at repo root with pnpm: `typegen` PASS, `typecheck` PASS, `lint` PASS (0 errors), `vitest run` PASS (42 files, 173 tests — a per-test 5s timeout tripped only under machine load, no assertion failures), `build` PASS. Per task instructions these were not re-run.

</details>

<details>
<summary>File map</summary>

- `src/components/ui/button.tsx` — base class: `transition-all` → `transition-[color,background-color,border-color,box-shadow]`, added `antialiased`.
- `src/components/molecules/accordion.tsx` — trigger: added `antialiased`.
- `src/components/organisms/media-info-card.tsx` — no change (already geometry-constant, transition already scoped).
- `src/components/ui/badge.tsx` — no change (no hover state).

Full diff: `git -C d:\devs\El-Kema-platform diff HEAD~1...HEAD`.

</details>
