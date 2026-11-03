# Hover/pressed/active/disabled sweep — implementation notes

Source of truth: `.agents/design-system/figma-hover-states.md` + `.agents/design-system/figma-tokens.md`.
Figma file key `y0eOLyKLtTHnJYzOW046WR`. Verified variant values via `get_variable_defs`.

## Audit result (summary)

The atoms, molecules, and organism cards were audited against their Figma
Default / Hover / Pressed / Disabled variants. **All of them already match**
their Figma variant values using existing tokens — no churn was applied to
correct code. The **only genuine mismatch** was the desktop nav links, which
used `hover:text-primary` with no underline instead of the Figma teal
hover-underline + navy active-underline. That was fixed. One new unit test was
added for the nav underline behavior.

Hover is not screenshot-able from the static Figma export, so each implemented
state below is verified by matching the implemented class to the confirmed
Figma variable value.

## Files changed by this step

- `src/components/shared/nav-links.tsx` — fixed hover/active underline + colors.
- `src/components/shared/nav-links.test.tsx` — NEW: tests the active + hover classes.

(Pre-existing uncommitted changes `src/components/molecules/progress-ring.tsx`
and `src/components/organisms/progress-tracking-card.tsx` were left untouched
and preserved — not part of this step.)

## Nav links — `src/components/shared/nav-links.tsx` (Figma Nav Bar/Label 451:1034)

Confirmed Figma values (`get_variable_defs` on 451:1034):

- `Nav Bar/Label/Hover` = `#14b8a6` ; `Nav Bar/Border/Hover` = `#14b8a6` ; `Nav Bar/Border/Weight` = `2`
- `Nav Bar/Label/Pressed` = `#123458` ; `Nav Bar/Border/Pressed` = `#123458`
- `Nav Bar/Label/Disabled` = `#a1a1aa`

Implemented classes → Figma variant token:

| State                           | Implemented class                              | Figma value / token                                               |
| ------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| Default label                   | `text-muted-foreground`                        | muted `#a1a1aa` family (Default/Disabled label)                   |
| Default underline (reserved)    | `border-b-2 border-transparent pb-1`           | Border weight `2`, transparent so hover/active never shift layout |
| Hover label                     | `hover:text-secondary`                         | `#14b8a6` → `--secondary`                                         |
| Hover underline                 | `hover:border-secondary` (on the `border-b-2`) | 2px `#14b8a6` → `--secondary`                                     |
| Active label (aria-current)     | `aria-[current=page]:text-primary`             | `#123458` → `--primary`                                           |
| Active underline (aria-current) | `aria-[current=page]:border-primary`           | 2px `#123458` → `--primary`                                       |
| Transition                      | `transition-colors`                            | color-only state change                                           |

Server/Client split preserved: `nav-links.tsx` stays the `"use client"` child
that reads `usePathname()` and marks the active link with `aria-current="page"`;
`navbar.tsx` stays a Server Component. Logical properties only (`border-b`,
`pb`). Colors resolve through tokens so light + dark both follow.

Note on the previous `text-primary-pressed` active color: Figma's confirmed
`Nav Bar/Label/Pressed` is `#123458` = `--primary` (not `--primary-pressed`
`#0d2947`), so the active label now uses `text-primary` to match exactly.

## Components verified as already matching Figma (no edit needed)

Atoms:

- **Button** (`ui/button.tsx`) — filled/outline/ghost × primary/secondary/destructive/inverse hover+active classes equal the Figma Button hover/pressed bg+border tokens (`hover:bg-primary-hover hover:border-primary-pressed active:bg-primary-pressed`, etc.). Disabled `disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground`.
- **Input** (`ui/input.tsx`) — Default `hover:border-primary hover:bg-primary-light`; Filled accent surface. Matches Figma Input Default/Hover/Filled.
- **Checkbox** (`ui/checkbox.tsx`) — `hover:border-primary hover:bg-primary-light`, `data-[state=checked]:bg-primary border-primary text-primary-foreground`, disabled muted. Matches.
- **Radio** (`ui/radio-group.tsx`) — same hover + `data-[state=checked]:border-primary`, disabled muted. Matches.
- **Switch** (`ui/switch.tsx`) — `data-[state=checked]:bg-primary border-primary-hover`, off/disabled `bg-muted border-muted-foreground`. Matches.
- **Tags** (`ui/tags.tsx`) — Default muted; Hover `hover:border-primary hover:bg-primary-light hover:text-primary`; Pressed/selected `bg-primary text-primary-foreground border-primary-foreground`; disabled muted. Matches Figma Tags Default/Hover/Pressed/Disabled.
- **Select/Dropdown** (`ui/select.tsx`) — Default muted subtle; `hover:border-primary hover:bg-primary-light hover:text-primary`. Matches Figma Dropdown Default/Hover.
- **SelectableCard** (`molecules/selectable-card.tsx`) — Default muted; Hover `hover:border-primary hover:bg-primary-light hover:text-primary`; selected `border-primary bg-card text-primary`; disabled muted. Matches.

Molecules:

- **Accordion** (`molecules/accordion.tsx`) — trigger `hover:bg-primary-light`, chevron rotate on open. Matches.
- **Pagination** (`molecules/pagination.tsx`) — current `bg-primary text-primary-foreground border-primary-hover`; others `hover:bg-primary-light`. Matches.
- **Button Group** (`molecules/button-group.tsx`) — active `bg-primary-pressed border-primary-pressed` over the Button atom; inactive outline with the atom's `hover:bg-primary-light`. Matches.
- **Search** (`molecules/search.tsx`) — reuses Button (ghost) + Input (hover tint) atoms; inherits their verified states.

Organism cards:

- **OurWorkCard** (`organisms/our-work-card.tsx`, 753:4774) — Default stroke 1.5 + `shadow-card`; `hover:border-[1.5px] hover:border-border` + `focus-within`. Figma 753:4774 payload confirms `Cards Tokens/Stroke-Weight/Medium` 1.5 + `Card Shadow`. Matches; `cursor-pointer` not needed (CTA is the Button).
- **WhyToStartCard** (`organisms/why-to-start-card.tsx`, 769:3074) — `hover:border-primary-light-strong hover:shadow-card` + `focus-within` + `state` prop. Matches.
- **Levels** (`organisms/levels.tsx`, 901:10148) — `hover:border-primary hover:bg-primary` with inverse text/icon/button via `group-hover`. Matches the confirmed Figma hover payload.
- **Suggestion** (`organisms/suggestion.tsx`) — First/Second emphasis states (no separate hover variant in Figma). Static as designed.
- **PlansCard** (`organisms/plans-card.tsx`) — Default/Pro states (no hover variant). Static as designed.
- **MediaInfoCard** (`organisms/media-info-card.tsx`) — course/instructor display card; Figma has no Hover variant (fixed 1.5 border + `shadow-card`). Left static per spec; CTA Button owns its own hover.
- **OfferCard** / **ProgressTrackingCard** (`organisms/offer-card.tsx`, `organisms/progress-tracking-card.tsx`) — gradient promo cards with no Figma hover variant. Static as designed; their CTA Buttons own hover.

## Verification run (repo root, pnpm, PowerShell)

Run once on the working tree containing the changes above:

- `pnpm run typegen` → PASS (`✓ Types generated successfully`)
- `pnpm run typecheck` → PASS (`tsc --noEmit`, exit 0, 0 errors)
- `pnpm run lint` → PASS (`eslint`, exit 0, 0 errors)
- `pnpm run test` → PASS (`vitest run`): **41 test files, 168 tests passed, 0 failed** (was 40 files / 165 tests before — +1 file, +3 tests from `nav-links.test.tsx`)
- `pnpm run build` → PASS (`next build`, exit 0; all routes prerendered)

## Git state

Nothing committed, nothing staged (`git status --short` shows working-tree
`M`/`??` only). Pre-existing uncommitted changes preserved:
`src/components/molecules/progress-ring.tsx`,
`src/components/organisms/progress-tracking-card.tsx`.
