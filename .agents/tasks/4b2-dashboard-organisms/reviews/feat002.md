# Dashboard stat/status cards + activity feed (FEAT-002)

Four composition-only dashboard organisms land under `src/components/organisms/`: `DashboardMetricCard` (Default/Hover), `Subscriptions` (Active/Expired/Cancelled), `HighlightCard` (Students/Courses) and `ActivityItem` (Secondary/Error/Warning feed row). Each is prop-driven, `forwardRef`, cva-variant-driven, built from existing tokens/atoms/icons, and colocated with a unit test. They establish the shared 32px icon-chip + status-color + card-chrome (`rounded-lg` + `p-6` + `border` + `shadow-card`) patterns the later FEAT items reuse. The commit touches only these nine files; no app page imports them, and no dependency, token, or message key was added in this diff.

Watch for: `ActivityItem` renders a bare `<li>` and never asserts the `<ul role="list">` wrapper itself (confirmed) — the list-semantics contract lives entirely with the consumer and is only exercised in the test harness. Minor: the status chip and leading bar are `aria-hidden` while the status is conveyed by color alone (confirmed), so a screen-reader user gets name/action/time but not the status category. Neither is blocking.

**Verdict**: APPROVED

## High-level view

The four organisms follow one shared shape: a cva base class for the card chrome plus a small per-concern cva (`chipVariants`, `dotVariants`) that maps a single `status`/`variant`/`state` prop onto token-backed color classes. Nothing restyles the atoms or icons it composes — the Badge atom is used as-is with `variant="secondary" tone="light"`, and icons are dropped into chips via a `[&>svg]:size-5` escape hatch rather than being re-skinned. Every token referenced (`shadow-card`, `border-primary-hover`, `secondary-light`, `destructive-light-strong`, `warning-light`, `text-h4-semibold`, `text-body`) is defined for both light and dark in `globals.css`.

Layout is logical-property-only throughout: `text-start`, `gap`, `justify-between`, `ps/pe`-free flex. No `left/right`, no physical margins/padding, no directional radii, no raw `rgba` in any component — the only `rgba` in the repo is the pre-existing `--shadow-card` token definition, which these cards consume through the `shadow-card` utility.

The API surface is uniform and prop-driven: `label`/`value` on the cards, `name`/`action`/`time` on the feed row, an optional `icon` ReactNode override on all four, and the variant discriminator (`state`/`status`/`variant`). Copy is passed in by the caller; none of the four calls `useTranslations`, so the diff adds no `organisms.dashboard` keys — consistent with the spec's conditional, and the namespace already present in both message files is in parity for this slice.

The known gap is accessibility depth on `ActivityItem`: it exposes list-item semantics correctly but leans on color alone to communicate status, and the status-bearing chip is hidden from assistive tech. Acceptable for a library primitive whose consumer supplies the surrounding context, worth noting for whoever wires the feed into a page.

<details>
<summary>Issues (2)</summary>

1. **ActivityItem status is color-only** — the leading bar and trailing chip are `aria-hidden` and the status category (secondary/error/warning) is conveyed purely by color; a screen-reader user hears name/action/time but not the status. Consider a visually-hidden status word or an accessible name on the row when wired into a page. Non-blocking.
2. **List-semantics contract is consumer-owned** — `ActivityItem` renders a bare `<li>`; the `<ul role="list">` wrapper is only guaranteed in the test harness, not enforced by the component. Fine for a primitive, but document the wrapping requirement at the consumption site. Non-blocking.

</details>

<details>
<summary>Details</summary>

### Shared chrome and the single-source status mapping

All four cards resolve their color system from one variant prop rather than per-element props, which is what keeps the "no duplicated styling" promise. `Subscriptions` is the clearest example: the base cva maps `status` to the full surface+border+text triple (`bg-secondary-light border-secondary text-secondary` for active, the destructive family for expired, the warning family for cancelled), and a second `chipVariants` maps the same `status` to the chip fill. The value row then inherits the status text color from the container via `text-h4-semibold` with no color override, so the H4 picks up the card's `text-*` color. One prop drives surface, border, label, chip and value together — adding a status later means one entry in two cva maps.

`DashboardMetricCard` uses `state` (default/hover) for chrome only: default is `border-border`, hover adds `border-primary-hover shadow-card` on top of a `transition-[color,box-shadow]` base. The navy chip is a fixed `bg-primary text-primary-foreground` rather than a variant, matching the single-chip Figma spec, and the trend Badge is the atom used verbatim (`variant="secondary" tone="light"`) rather than a re-implementation. `HighlightCard` collapses Students/Courses into one component where the variant swaps only the default icon (`StudentIcon`/`BookOpenedIcon`) and chip accent (`bg-secondary`/`bg-primary`).

### Logical properties and token discipline

Grepping the four components for `left|right`, directional radii, physical margins/padding and `rgba(` returns only false positives (`rounded-lg`, `border`). Alignment is `text-start`, spacing is `gap`/`justify-between`, so all four mirror correctly under RTL without any conditional direction logic. No color is expressed as a raw channel value — every surface and text color is a token utility, and the card shadow is the `shadow-card` utility backed by the pre-existing `--shadow-card` token (the sole `rgba` literal, defined once in `globals.css`, unchanged by this diff and identical across light/dark by design).

### API surface and i18n posture

Each component takes `React.ComponentProps<...>` minus `children` plus its variant props, so arbitrary DOM attributes and `className` pass through and `cn` merges cleanly. `aria-labelledby` + `React.useId()` ties each card to its label node on the three card components; `ActivityItem` omits it because its name is the row's primary text. Copy is entirely caller-supplied — no component reads translations — which is why the diff adds no `organisms.dashboard` keys. The namespace already exists in both message files with matching key sets for this slice (`logout`, `search`, `welcome`, `subscriptions.*`, `activity.title`, `report.*`), so parity holds.

### ActivityItem feed semantics

The row renders `<li data-slot="activity-item" data-status=…>` with a leading 12px status bar, a name/meta text block, and a trailing status-light chip, and forwards its ref as `HTMLLIElement`. This is the right primitive for a feed — the consumer supplies `<ul role="list">`. Two a11y observations: the status is communicated only through the color of the bar/chip/action text, and both the bar and chip carry `aria-hidden`, so assistive tech gets the name, action and time but no status category. For a page-level feed this would warrant a visually-hidden status word; as a library primitive it's a reasonable boundary to leave to the consumer. The `showDot` prop correctly gates the 4px separator and only renders it when both action and time are present.

### Test coverage

Each component has a colocated test following the `plans-card.test.tsx` pattern (render inside `NextIntlClientProvider` with `en.json`). Covered across the four: label/value (or name/action/time) render, the variant/status/state `data-*` attribute for every variant, the optional trend badge, and a custom-icon override. `ActivityItem` additionally asserts `getByRole("listitem")` inside a `<ul role="list">` wrapper, which exercises the list contract. The coder's commit message records `npx vitest run src/components/organisms` at 29 passed (11 new) and the full suite at 94 passed, typecheck/typegen/lint green; per the task these were not re-run here.

Not tested: dark-mode rendering (token-level, not asserted), RTL mirroring (relies on logical properties, no explicit `dir="rtl"` test), and the `aria-labelledby` wiring on the three card components (the `useId` association is present but no test asserts the accessible name resolves). None are blocking for this slice.

### File map

<details>
<summary>Files changed (9)</summary>

- `src/components/organisms/dashboard-metric-card.tsx` — new metric card, `state` cva (default/hover), navy chip, Badge atom reuse
- `src/components/organisms/subscriptions.tsx` — new status card, `status` cva mapping surface/border/text/chip
- `src/components/organisms/highlight-card.tsx` — new compact row, `variant` cva (students/courses) swapping icon+accent
- `src/components/organisms/activity-item.tsx` — new `<li>` feed row, `status` cva for bar/action/chip
- `src/components/organisms/*.test.tsx` (4) — colocated unit tests
- `src/components/organisms/index.ts` — barrel exports for all four components + their `*Variants`

Full diff: `git diff 878167d..ebf05f2 -- src/components/organisms`

</details>

</details>
