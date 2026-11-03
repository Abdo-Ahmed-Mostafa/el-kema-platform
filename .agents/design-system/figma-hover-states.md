# Hover / pressed state sweep — El-Kema (match Figma exactly)

Audit EVERY interactive component against its Figma hover/pressed/active variant and make the implemented states match. Figma file key `y0eOLyKLtTHnJYzOW046WR`. Use `get_variable_defs` + `get_screenshot` on each component's variant nodes. RTL default; logical properties only. Reuse existing tokens (primary #123458 + primary-hover #102f50 + primary-pressed #0d2947 + primary-light #eff5fa + primary-light-strong #d9e6f2; secondary #14b8a6 + hover #12a596 + pressed #0f8f81; etc. — all already in globals.css). Do NOT change tokens or the font.

## Known Figma hover/pressed values (confirmed) — apply where missing

- **Nav links** (node 451:1034, "التسمية" Default/Hover/Pressed/Disabled): Default label = muted/foreground; **Hover** label `#14b8a6` (secondary) + a 2px bottom border `#14b8a6`; **Pressed/active** label `#123458` (primary) + 2px bottom border `#123458`; Disabled `#a1a1aa`. The current NavLinks likely lack the teal hover underline + active navy underline — implement an underline-on-hover (teal) and active-route (navy) treatment using logical border-b, keeping the Server/Client split (active marking already in nav-links.tsx via aria-current).
- **OurWorkCard** (node 753:4774, Default/Hover): hover raises stroke to 1.5 and adds the card shadow (shadow-card). Ensure hover applies the elevated border + shadow.
- **WhyToStartCard** (769:3074 area) / **Levels** / **Suggestion** / **Plans** / **MediaInfoCard** / **OfferCard** / **ProgressTrackingCard**: check each node's Default vs Hover variant; where Figma shows a hover (shadow lift, border emphasis, or color shift), implement it with a transition. Cards that are links/clickable get hover:shadow-card + the Figma border/elevation; non-interactive display cards stay static if Figma has no hover variant.
- **Atoms** (Button, Input, Checkbox, Radio, Switch, Tags, Select/Dropdown, SelectableCard): these ALREADY implement hover/pressed (verified: hover:border-primary hover:bg-primary-light, data-[state], etc.). VERIFY each against its Figma variant values and fix only genuine mismatches — do not churn correct code.

## Scope

Sweep across: src/components/ui/* (atoms), src/components/molecules/* (incl. nav-related, accordion, pagination, selectable-card, tags), src/components/shared/nav-links.tsx + navbar.tsx, src/components/organisms/* (all cards), and the home _sections wrappers if a section applies hover at the wrapper level.
For EACH interactive component:

1. Open its Figma variant(s) via get_variable_defs/get_screenshot (Default vs Hover vs Pressed/Active vs Disabled).
2. Compare to the implemented classes.
3. If the implemented hover/pressed/active/disabled does not match Figma, fix it using existing tokens + transition-colors (and transition-shadow where elevation changes). Add `cursor-pointer` to clickable non-button elements where appropriate.
4. Respect prefers-reduced-motion only matters for continuous animation (not needed for hover transitions).

## Requirements

- Match Figma hover/pressed/active/disabled per component; use existing tokens only; logical properties only (no left/right); works light + dark; keep all public APIs and tests. Prop-driven; no token/font changes. Keep ar/en parity if any copy changes (unlikely). Don't restyle components that already match — minimal, surgical edits.
- Add/adjust unit tests only where behavior meaningfully changed (e.g. nav active-underline class).

## Verification (repo root, pnpm, all must pass)

`pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Verify a few hover states visually by reasoning from the classes (hover is not screenshot-able via the static Figma export, but confirm the implemented hover classes equal the Figma Hover variant values).

## IMPORTANT: do NOT commit

Leave ALL changes uncommitted in the working tree (do not run git commit, do not stage for commit as a final step). The user will review and commit manually. Note: there are already uncommitted changes in the tree (navbar theme/locale controls, progress-ring spinner tweaks) — preserve them; build on top; do not revert or commit them.
