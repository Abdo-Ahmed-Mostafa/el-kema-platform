# Root cause — hover layout-shift on Home cards + FAQ

## Symptom

On the Home page, hovering the course/instructor cards (and FAQ rows) made the
text look like it changed size / nudged. Requirement: resting vs hover may
differ **only** in color + shadow, never geometry.

## What was inspected (resting vs hover class sets)

- `src/components/organisms/media-info-card.tsx` — `<article>` uses a constant
  `border-[1.5px]`; hover only adds `hover:border-primary hover:shadow-xl`, and
  the transition is already scoped to `transition-[color,border-color,box-shadow]`.
  The CTA is promoted outline→filled via `group-hover:bg-primary`,
  `group-hover:text-primary-foreground`, `group-hover:border-primary-hover`.
- `src/components/ui/button.tsx` — both `outline` and `filled` include `border`
  (1px), so **border width is constant** across the swap. Padding/size come from
  the `size` variant and do not change on hover. **But the base class was
  `transition-all`.**
- `src/components/molecules/accordion.tsx` — trigger: constant `px-4 py-4`,
  `text-[20px] leading-8 font-medium`; hover only flips `bg-primary` +
  `text-primary-foreground`. Geometry constant.
- `src/components/ui/badge.tsx` — floating rating badge has no hover classes;
  it never changes on card hover. Not a cause.

## Measurable geometry delta?

None. No hover/group-hover class changes border-width, padding, font-size,
font-weight, letter-spacing, line-height, or applies a transform. The
outline→filled CTA swap keeps identical box metrics (1px border + same padding
in both states) — only `background-color`, `color`, `border-color` change.

## The real cause

The perceived "text resize" came from **glyph re-rasterization during the
hover transition**, not from any box-metric change:

1. `Button` carried `transition-all`. When the CTA flips from
   `bg-transparent` (outline) to `bg-primary` (filled) on `group-hover`,
   `transition-all` transitions _every_ animatable property. As the solid navy
   fill animates in behind the text while `color` flips to white, the browser
   re-rasterizes the anti-aliased glyphs against a continuously changing
   backdrop for the whole transition. That repaint reads as the text
   subtly breathing / changing size, even though the layout box is static.
2. The accordion trigger has the same white-on-navy color flip and benefits
   from the same antialiasing stabilization.

The global `<html>` already sets grayscale `antialiased` (see
`src/app/[locale]/layout.tsx`), which is backdrop-independent; pinning the same
mode on the elements that flip to white-on-navy keeps smoothing consistent
through the transition.

## Fix (minimal, surgical — existing tokens only, logical props preserved)

- `button.tsx`: replaced `transition-all` with
  `transition-[color,background-color,border-color,box-shadow]` so nothing
  geometric can animate, and added `antialiased` to pin backdrop-independent
  grayscale smoothing through the fill transition.
- `accordion.tsx`: added `antialiased` to the trigger for the same
  white-on-navy flip stability.
- `media-info-card.tsx`: already scoped its transition to color/border/shadow
  and keeps a constant border width; no change needed.
- `badge.tsx`: no hover change; no edit needed.

Resting vs hover now differ only in color + shadow with identical box metrics.
The approved Figma hover look is preserved (card shadow lift + border-primary,
CTA outline→filled navy, FAQ navy hover). Works in light + dark (semantic
tokens unchanged). Public APIs and all tests unchanged / green.

## Verification

`pnpm run typegen` ✓, `pnpm run typecheck` ✓, `pnpm run lint` (0 errors) ✓,
`pnpm run test` (173 passed, 42 files) ✓, `pnpm run build` ✓.
