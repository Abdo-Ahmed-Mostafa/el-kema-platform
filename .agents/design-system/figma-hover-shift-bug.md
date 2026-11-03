# Bug: text/content shifts on card hover (Home course/instructor cards + FAQ)

User report: on the Home page, when hovering the course/instructor cards (and the FAQ rows), the TEXT appears to change size / the layout shifts slightly. Content must stay perfectly static on hover — only colors/shadow should change, never geometry (no reflow, no size/position jump of any text or element).

This is a DIAGNOSE-THEN-FIX task. Do not guess; reproduce and find the real cause, then fix it so hovering changes only color/shadow with zero layout movement.

Files:

- src/components/organisms/media-info-card.tsx — the course/instructor card. On hover it: changes border-color (border is a constant 1.5px, so width shouldn't change), adds hover:shadow-xl, and promotes the CTA Button from outline→filled via group-hover (bg-primary + text-primary-foreground + border-primary-hover).
- src/components/ui/button.tsx — Button. Both `filled` and `outline` include `border` (1px) so border width is constant; the card CTA adds group-hover color classes. Button has `transition-all`.
- src/components/molecules/accordion.tsx — FAQ trigger turns solid navy on hover (bg-primary + text-primary-foreground).

Likely causes to check (verify which actually applies, fix the real one):

1. Any hover/group-hover class that changes box geometry: border WIDTH change (e.g. an element whose resting state has no border but hover adds one, or 1px vs 1.5px mismatch), padding change, font-size/weight/letter-spacing/line-height change, or a transform. Grep the card, button, badge, and accordion for hover:/group-hover: that touch border-width, p-, text-size, font-, tracking, leading, or transform.
2. Sub-pixel text reflow from font smoothing: when text color flips to white on a navy background some browsers re-render antialiasing and text can look like it nudges. If the geometry is actually constant and the shift is only perceived from color, add `[text-rendering:geometricPrecision]`/`subpixel-antialiased` stability or ensure the element reserves its space; but prefer fixing a real geometry cause first.
3. `transition-all` animating an unintended property. Scope Button + card transitions to only color-ish props (color, background-color, border-color, box-shadow) so nothing geometric can animate.
4. The floating rating Badge or CTA changing size when its colors change.

Fix requirements: hovering any card or FAQ row must NOT move or resize any text/element — only color + shadow change. Keep the Figma-accurate hover look already implemented (card lift via shadow, border-primary, CTA promoted to filled navy, FAQ navy hover). Use existing tokens; logical properties only; light + dark; keep public APIs + tests green; minimal surgical edits. If the CTA outline→filled is what causes a 1px shift, make the resting and hover states have identical box metrics (same border width, same padding) so only colors swap.

Add a note documenting the root cause you found.

Verification (repo root, pnpm, all must pass): `pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Commit to main when green (approved to commit). Confirm (by reasoning about the final classes) that resting vs hover differ only in color/shadow, not geometry.
