# Home Page + Navbar fixes — El-Kema (pixel-accurate to Figma)

The Home Page ("/") and the public Navbar have visual/behavior bugs vs Figma. Fix all of them and verify each against Figma with `get_screenshot`. Figma file key `y0eOLyKLtTHnJYzOW046WR`. Home frame node `624:3480`; Navbar node `451:1151`. Use `get_design_context` for exact values; ADAPT to tokens/atoms — never paste raw Figma Tailwind. This project uses pnpm. RTL (Arabic) is default; EN is LTR — everything must mirror correctly (logical properties only: ps/pe/ms/me/start/end — NEVER left/right).

Home page files: src/app/[locale]/(public)/page.tsx + its section wrappers in src/app/[locale]/(public)/_sections/ + the new organisms ProgressTrackingCard, MediaInfoCard, OfferCard under src/components/organisms/. Navbar: src/components/shared/navbar.tsx (+ nav-links.tsx). Progress ring molecule: src/components/molecules/progress-ring.tsx.

## FIX 1 — Progress band ("تابع تقدّمك في رحلتك التعليمية", section 1)

- The cards currently look squeezed/overflowing as if a half-built carousel pushed off-screen. They must be a clean, EQUAL-WIDTH row that fits within the page container (no horizontal overflow, no off-canvas bleed). Lay them out as an equal-width grid/flex (each card the same width, gap per Figma), fully inside the 1280 content width. Check the Figma node for how many cards and their exact widths (planner said 3 cards navy/teal/navy — verify against 624:3480 subtree and match the count + equal widths exactly).
- The small inner circle inside the big progress ring must ANIMATE: it should spin/rotate around the ring continuously like a loading indicator. Implement a smooth CSS rotation (respect prefers-reduced-motion: no animation when reduced). Keep the static 25% value in the center. Do this in the ProgressRing molecule (or the tracking card) in a reusable, accessible way (the ring keeps role=progressbar + aria values; the spinner is decorative aria-hidden).

## FIX 2 — Missing "discover more" CTAs

- Section 2 ("اكتشف الدورات التي تناسبك") is missing its "اكتشف أكثر" (discover more) link/CTA that Figma shows — add it (transparent/link style per Figma), routed sensibly (e.g. to /courses).
- Section 3 (instructors, "تعلّم على يد نخبة من المدرّسين") is likewise missing its "اكتشف أكثر" / "اكتشف الكل" CTA — add it per Figma (to /teachers).
- Match the Figma placement (below the card row, centered or per the frame) and style.

## FIX 3 — Second progress band text alignment ("تابع تقدّمك في رحلتك التعليمية", the offers/second band, section 4)

- The card text is currently centered but Figma puts it on the RIGHT (start, in RTL). Align the heading/body/CTA to the start (text-start, items-start) so in Arabic it sits on the right and in English on the left — matching Figma. Verify against the Figma node.

## FIX 4 — FAQ section ("كل ما تريد معرفته عن El-Qimah Learn")

- When an accordion item is opened, the answer is cramped/stuck to the trigger and looks bad. Add proper spacing/padding and the Figma styling for the expanded answer (padding between question and answer, answer typography = paragraph-xsm body color #52525a, border/surface per Figma). Fix in the FAQ Accordion molecule or FaqSection presentation without breaking its a11y (aria-expanded/region). Verify open + closed states against the Figma FAQ node.

## FIX 5 — RTL/LTR correctness across the whole Home page

- Audit every Home section + the new organisms: in Arabic (RTL) content/alignment must be on the RIGHT as in Figma; in English (LTR) it mirrors to the LEFT. Replace any physical-direction class (left/right/ml/mr/pl/pr/text-left/text-right) with logical equivalents. Confirm by get_screenshot in RTL and by reasoning about LTR mirroring.

## FIX 6 — Navbar must match Figma (node 451:1151)

Figma navbar (RTL) layout, left→right on screen:

- Logo pinned to the LEFT edge (the far side from reading start).
- Nav links centered in the middle.
- A single primary navy BUTTON with an icon on the RIGHT edge (the "call to action"/login-or-primary button).
- NO search bar in the nav row. NO visible locale/theme controls in the main row as currently rendered.
  Rework src/components/shared/navbar.tsx to match Figma exactly: correct element order and alignment (logo at the inline-start edge, links centered, primary button at the inline-end edge), remove the SearchBar from the row (unless Figma shows it — it does not in 451:1151), surface/padding/height per Figma (px-6, ~92px height, solid #fafafa / bg-card, bottom border, keep it sticky top-0 z-50). Keep i18n (nav namespace), keep the mobile sheet for small screens, keep Logo + links. If locale/theme toggles must stay for the product, place them tastefully (e.g. inside the mobile sheet or as subtle controls) but the DESKTOP row must visually match Figma. Verify with get_screenshot(451:1151) vs the built navbar in both RTL and LTR. The navbar is shared across all pages, so this updates the whole site consistently.

## Requirements

- Compose existing atoms/molecules/organisms; do not duplicate styling. Extend an organism/molecule only if needed and keep it backward-compatible (grep call sites). Prop-driven + next-intl, ar.json + en.json IN SYNC (messages-parity green). TypeScript, cn, logical properties only, light + dark, existing tokens + shadow-card. Respect prefers-reduced-motion for the spinner.
- Do NOT touch design tokens or the font. Do NOT rebuild the Landing Page.

## Verification (repo root, pnpm, all must pass)

`pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Use get_screenshot on 624:3480 (+ per-section nodes) and 451:1151 to confirm each fix with no visible drift, in RTL; reason about LTR mirroring. Commit to main. Clean up temp files.
