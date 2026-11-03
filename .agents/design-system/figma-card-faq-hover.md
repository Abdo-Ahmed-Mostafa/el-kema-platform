# Course card + FAQ hover — El-Kema (match Figma exactly)

Two hover treatments to match Figma precisely (user supplied reference screenshots; values confirmed via get_variable_defs). Figma file `y0eOLyKLtTHnJYzOW046WR`. Reuse existing tokens; no token/font changes. RTL default; logical properties only. Light + dark.

## 1. Course / Instructor card (MediaInfoCard) — Hover

Reference: the middle (English) course card in the screenshot is hovered. On hover the card must:

- Lift with the card shadow (`shadow-card`) and show a clearer primary border (the resting card has a subtle border; hover emphasizes it — border-primary / stroke emphasis).
- Tint the surface very slightly (the hovered card reads a touch lighter/elevated vs the flat resting ones) — use the existing primary-light tint only if Figma shows it; otherwise keep the surface and rely on shadow+border. Verify against the Figma Course Card hover variant.
- The CTA button ("احجز الآن") switches from its resting OUTLINED style to a FILLED navy primary button (bg #123458, text #fafafa) on card hover. In Figma the resting card CTA is outlined and the hovered card CTA is filled navy. Implement so hovering anywhere on the card promotes the CTA to filled (group-hover).
- Smooth transition-colors/transition-shadow; respect prefers-reduced-motion is not required for hover.
- Apply to MediaInfoCard (src/components/organisms/media-info-card.tsx) so both the courses and instructors sections get it. Keep the card clickable affordance (cursor-pointer). Use Tailwind `group`/`group-hover:` so the whole card drives the CTA + elevation.

## 2. FAQ Accordion — Hover + Answer (confirmed values)

Reference: FAQ screenshot — a hovered/active question trigger is SOLID NAVY, and the opened answer sits in a bordered white card below.

- FAQ trigger **Hover** (Figma 656:7298 State=Hover): surface primary `#123458`, text + chevron icon inverse `#fafafa`. So on hover the whole question row turns solid navy with white text/icon.
- FAQ trigger **Open/Answer** (Figma 656:7304 State=Answer): the trigger is navy `#123458` with inverse text while expanded; the answer panel is a card (surface `#f4f4f5`/white) with a primary border, body text `#52525a` (paragraph-xsm), padding 24.
- Resting (Default): current look (light surface, foreground text) — keep.
- Implement in the FAQ Accordion molecule (src/components/molecules/accordion.tsx) and/or FaqSection: add the navy hover state on the trigger (hover:bg-primary hover:text-primary-foreground with the chevron inheriting currentColor), and the open state navy trigger + bordered answer card. Keep aria-expanded/region a11y intact and the chevron rotation. Logical properties only. Verify open + closed + hover against the Figma nodes (656:7296 Default / 656:7298 Hover / 656:7304 Answer).

## Constraints

No new deps; existing tokens only; cn; logical properties only; light + dark; keep public APIs + tests green; prop-driven; ar/en parity if any copy added (none expected). Minimal surgical edits.

## Verification (repo root, pnpm, all must pass)

`pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Commit to main when green (this task is approved to commit).
