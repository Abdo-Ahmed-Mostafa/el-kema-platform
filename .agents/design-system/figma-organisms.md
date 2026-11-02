# Figma Organisms Inventory — El-Kema (stage 4B)

Source: Figma file `y0eOLyKLtTHnJYzOW046WR`, "Design System" page. Build on stage-1 tokens + stage-2/3 atoms + stage-4A molecules + icons. Reuse existing CSS variables / Tailwind utilities and composed atoms/molecules; do NOT redefine the core palette.

## Shared tokens to ADD in this stage (additive only, in globals.css + @theme inline)

These are referenced by many organisms and are not yet tokens. Add them cleanly (do not alter existing tokens):

- **Card shadow:** Figma "Card Shadow" = drop shadow, color navy `#123458` at ~12% alpha (`#1234581F`), offset (0, 4px), blur radius 10px, spread 0. Add as a shadow token (e.g. `--shadow-card`) and expose via Tailwind (e.g. `shadow-card`). Replace the raw rgba shadow the navbar currently uses with this token.
- **Card radii:** small 12px, medium 16px, xlarge 24px (sm/md/lg radius already exist = 8/12/16; add `--radius-card-xl` = 24 if missing, or reuse radius-xl which is currently base+4 ≈ 14 — prefer an explicit 24 token for cards).
- **Card padding scale:** large 24, xlarge 32 (use spacing utilities p-6 / p-8 as these equal 24/32px at Tailwind default; verify).
- **Gaps:** sub-section sm 12 / md 16, section lg 24 (= gap-3 / gap-4 / gap-6).
- **Border weights:** xs 0.5, sm 1, md 1.5.

## Typography scale (add any missing as utilities/classes; font is IBM Plex Sans Arabic from stage 1)

- H4: 28 / 40, Bold (700).
- Paragraph lg: 20 / 32, Medium (500).
- Paragraph sm: 16 / 24. Paragraph xsm: 14 / 20. Paragraph xxsm: 12 / 16. Weights: Regular 400, Medium 500, Semibold 600, Bold 700.

## Text colors (all already map to existing tokens — reuse)

- Default/strong `#18181b` (foreground), Body `#52525a` (add `--text-body` or use a muted foreground that matches), Secondary `#14b8a6`, Accent `#0f766e`, Primary `#123458`, Inverse `#fafafa`, Muted `#a1a1aa`.

## Surfaces

- Elevated/Default card `#fafafa` (card token), Subtle `#f4f4f5`, Primary Light `#d9e6f2`, Secondary Light `#ccfbf1`.

---

## Stage 4B-1 — Landing / marketing organisms (THIS sub-stage)

For exact structure/layout of each, use the figma power `get_design_context` on the node id (fileKey y0eOLyKLtTHnJYzOW046WR), then ADAPT to tokens/atoms/molecules — never paste raw Figma code. Build each as a composable, prop-driven component (content via props/children + next-intl, no hardcoded copy). Place under src/components/organisms/ with a barrel.

- **Plans Card** (803:4431) — states Default / Pro(highlighted). Pro uses highlighted stroke + primary accents + "Pro Plan Price Frame". Card radius xlarge 24, padding xlarge 32, card shadow, badge, price, feature list with check icons, CTA button (primary / outlined). H4 title.
- **Our Work Card** (753:4774) — states Default / Hover. Image (radius none at top), badge (secondary), title paragraph-lg, body `#52525a`, CTA. Card shadow + medium stroke 1.5 on hover.
- **Why To Start Card** (769:3074) — states Hover / Default. Icon + heading + text, 194x206.
- **Why Elqimah** (739:2952) — states Hover / Default. 336x86 row: icon + title + subtitle.
- **Trust Section** (843:5333) — State Default. 336x74 trust row (logos/stats).
- **Instructor Hero Card** (856:5879) + hero image (856:5883) — instructor profile hero (470 wide).
- **Suggestion** (685:8032) — states First / Second (628x258 each).
- **How To Start** (791:3459) — 258x68 step indicator.
- **Levels** (901:10148) — states Default / Hover (281x240) + The Levels Details (947:3942). Level card with primary surface, inverse text, badge.
- **Leaderboard** (881:9322) — 318x376 ranked list with avatars, rank badges, scores.
- **FAQs section** — compose the stage-4A FAQ Accordion into a section wrapper (656:7297 context).

## Requirements (all organisms)

- Compose from existing atoms (Button, Badge, Card, Input, Avatar…), molecules (Accordion, Pagination, ProgressRing, SelectableCard…), and icons. Do NOT duplicate their styling.
- Prop-driven + next-intl for any default copy (add keys to messages/ar.json + messages/en.json in sync). Content should be passed in by consumers; organisms provide structure + styling.
- TypeScript, `cn`, cva for variant states (default/hover/pro/etc.), forwardRef where idiomatic, full a11y (headings hierarchy, landmarks, aria, keyboard, focus-visible ring token), RTL+LTR via logical properties only (ps/pe/start/end — never left/right), light + dark.
- Use the new card shadow token, not raw rgba. Images via next/image where applicable (use placeholder src / accept src prop; do not embed Figma asset binaries unless a brand asset is required and fetched via get_design_context).
- Barrel-export from src/components/organisms/index.ts. Do NOT adopt into real app pages yet (that is the final integration stage) — build the library + unit tests only.

## Verification

From repo root (all must pass): `npm run typegen` then `npm run typecheck`, `npm run lint` (0 errors), `npm run test`, `npm run build`. Fix every failure; done only at zero errors. Clean up temp files. Commit to main.

---

## Stage 4B-2 — Dashboard organisms (next sub-stage)

Figma "Dashboard" section (id 1071:13075). Use get_design_context on each node id (fileKey y0eOLyKLtTHnJYzOW046WR) for exact structure, then ADAPT to tokens/atoms/molecules/organisms — never paste raw Figma code. All share the same token system (card radius medium 16, padding large 24, shadow-card, section gap 24). Place under src/components/organisms/ (same folder + barrel as 4B-1).

New typography token observed: Paragraph md = 18 / 28, Medium (500). H4 also has a Semibold (600) variant (in addition to Bold 700). Add these if missing (additive).

Semantic status colors (all already map to existing tokens — reuse): Secondary/Default `#14b8a6` + light `#ccfbf1`; Error surface `#ef4444` / text `#ef4444` / light `#fee2e2` / border `#dc3d3d`; Warning surface `#df900a` / light `#fef3c7` / border `#c47e09`; Disabled `#a1a1aa`; Accent `#0f766e`.

Components in scope (4B-2):

- **Dashboard Side Menu** (952:4135) + Side Menu Section (952:4686, states Default/Selected). Nav item: paragraph-md medium, Selected = primary surface #123458 + inverse text/icon, radius medium 16, icon-text gap 8. Reconcile with existing src/components/layouts/dashboard-sidebar.tsx (preserve API + config/dashboard-nav.ts usage).
- **Dashboard Header** (955:4905) — reconcile with existing dashboard-shell/header if present.
- **Dashboard Metric Card** (965:5276, states Default/Hover) — stat card: H4 semibold value, label, trend badge (secondary light), icon. Radius 16, padding 24, card shadow on hover.
- **Subscriptions** (1049:12356, states Active/Expired/Cancelled) — subscription status card using secondary/error/muted semantic colors.
- **Highlights Cards** (1016:8697, states Students/Courses) — small highlight stat (400x83) icon + number + label.
- **Platform Performance** (979:6234, State=Revenue) — revenue chart card (679x297). Chart can be a lightweight SVG/placeholder or use a simple bars component; do NOT add a charting dependency unless truly required (prefer a small custom SVG bar/line built from tokens).
- **Payment Method Chart** (1030:10140) + **Bar Chart** (1042:12226) — chart cards; custom SVG from tokens, no new dep.
- **Payment** (1049:12711, Vodafone/Orange/Visa) — payment-method rows using the brand payment icons from stage 3.
- **Activity** (999:7499, states Secondary/Error/Warning) — activity feed row (400x101) with semantic status (secondary/error/warning surfaces + light backgrounds + icons).
- **Report** (1126:19055, states Course/Student/Exam/Lecture + Student Header) — tabular report rows (900 wide) with header row; use semantic tokens.
- **Filter / Filter Group / Payment Filter** (1027:9355, 995:7467, 1032:10384) — filter chips/segmented filters (reuse Tag/ButtonGroup molecules).
- **Course Performance** (1008:7826), **Recent Activity Course** (1089:15840, states 1/2), **Testimonials** (711:9325), **Exam Card** (1166:23315), **Student Overview** (1174:24931), **Student Data** (1173:24352) — additional dashboard cards; build the ones that are distinct, compose atoms/molecules.

Requirements: identical to 4B-1 (compose, prop-driven, next-intl synced ar/en, TS, cn, cva, forwardRef, full a11y, logical-props RTL/LTR, light+dark, shadow-card token, no new charting dep — custom SVG for charts, barrel-export, unit tests for non-trivial, NO app-page adoption yet). Verify with typegen/typecheck/lint/test/build at zero errors; commit to main.
