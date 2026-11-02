# Dashboard charts, payment rows and filters (FEAT-003)

Adds six dependency-free dashboard organisms to `src/components/organisms`: a custom SVG line chart (`PlatformPerformance`), a generic flex `BarChart` with a brand-colored `PaymentMethodChart` preset, a `PaymentRow` list item, and a `Filter`/`FilterGroup`/`PaymentFilter` family that reuses the existing `Tag` atom. Charts and brand colors are hand-built — no charting library is pulled in, and the payment-brand hex values live as data inside the preset/consumer rather than in `globals.css`. Copy is prop-driven with next-intl fallbacks under `organisms.dashboard.payment`, added to both `en.json` and `ar.json` in sync. Everything is barrel-exported with colocated tests.

Watch for: `FilterGroup` composes the ButtonGroup _selection convention_ but does not import the `ButtonGroup` molecule — the spec's "compose ButtonGroup semantics" is met behaviorally, not by component reuse (possible). No roving-tabindex/arrow-key navigation inside `FilterGroup`; keyboard operability is per-chip Tab + Enter/Space only (confirmed). Everything else the task flagged as blocking is clean.

**Verdict**: APPROVED

## High-level view

The charts avoid any charting dependency as required. `PlatformPerformance` computes a polyline in a fixed numeric viewBox and draws gridlines/line/points as raw SVG; `BarChart` scales flex-column heights to `value/max` clamped to 0..100%. `package.json` is untouched by the commit, verified against the diff.

Brand colors are kept as data in exactly the right places: `PAYMENT_METHOD_COLORS` in `payment-method-chart.tsx` and `PAYMENT_ROW_AMOUNT_COLORS`/icon map in `payment-row.tsx`, applied via inline `style`. `globals.css` is not in the diff and contains none of the brand hexes.

Accessibility for charts is handled with `role="img"` + an `aria-label` summary plus a visually-hidden text summary (an `sr-only` `<ul>` in BarChart, an `sr-only` `<p>` in PlatformPerformance). The inner SVG is `aria-hidden`, so the plot is announced once via the summary.

Filters reuse `Tag` untouched — `Filter` forwards `selected` straight to Tag's native `aria-pressed` button and adds no className override, so Tag is not restyled. `FilterGroup` is a `role="group"` + `aria-label` container with controlled single/multi select. The one gap worth noting is that group-level keyboard navigation relies on native tab order rather than roving focus with arrow keys.

i18n strings are mirrored between `ar.json` and `en.json`, and all new symbols are barrel-exported from `index.ts`. Tests are colocated and assert the behaviors the spec calls for.

<details>
<summary>Issues (2)</summary>

1. **ButtonGroup not actually reused** — `FilterGroup` reimplements selection semantics in a `role="group"` div instead of composing the `ButtonGroup` molecule the spec names. Behavior is correct and Tag/ButtonGroup are not restyled; confirm the author intended convention-only reuse, otherwise none needed.
2. **No arrow-key navigation in FilterGroup** — chips are reachable by Tab and operable with Enter/Space, but there is no roving-tabindex/arrow-key movement within the group. Acceptable for a chip group; consider adding if the design calls for single-tab-stop behavior.

</details>

<details>
<summary>Details</summary>

### Blocking-check verification

Three of the task's blocking checks are verified against the commit directly. `package.json` and `package-lock.json` are absent from `git show 4c23ece --name-only` — no charting dependency added (confirmed). A hex scan of `globals.css` for the brand values (`e60000`, `ff7900`, `1434cb`, `007300`, `000000`) returns nothing and the file is not in the diff, so brand colors stay out of the theme layer; they live as data in `PAYMENT_METHOD_COLORS` (`payment-method-chart.tsx`) and the icon map + `PAYMENT_ROW_AMOUNT_COLORS` (`payment-row.tsx`), applied via inline `style` (confirmed). A grep of the six new files finds no `rgba` and no physical `left`/`right` properties — logical utilities only (confirmed). All new symbols (components, `PAYMENT_METHOD_COLORS`, public types) are barrel-exported from `index.ts`, and the `organisms.dashboard.payment` block is identical in `ar.json` and `en.json` (confirmed) — the remaining two blocking checks.

`BarChart`'s height clamp is `Math.min(100, Math.max(0, value/safeMax*100))%` with `safeMax` guarded to 1, pinned by a test where value 200 against max 100 resolves to `100%`.

### Chart accessibility summaries

Both charts wrap the plot in `role="img"` with a generated-or-overridable `aria-label`, and both render a redundant visually-hidden textual summary: an `sr-only` `<ul>` of `label: value` in BarChart and an `sr-only` `<p>` joining the series in PlatformPerformance. In PlatformPerformance the `<svg>` is itself `aria-hidden` with `focusable="false"`, so assistive tech gets the summary, not the raw path. The required chart a11y summary is present in both (confirmed).

### Tag reuse without restyling

`Filter` renders `<Tag selected={selected} icon={icon} {...props}>` and passes no `className`, so Tag's variant styling and its native `<button aria-pressed>` body are untouched; the filter test confirms a selected chip exposes `aria-pressed="true"` (confirmed, Tag not restyled).

`FilterGroup` interprets the spec's "compose ButtonGroup semantics" loosely: it builds a `role="group"` + `aria-label` div and manages selection itself rather than importing the `ButtonGroup` molecule. This satisfies the labelled, controlled, single/multi-select requirement and leaves ButtonGroup unmodified, but a reviewer expecting literal ButtonGroup composition should note the divergence (possible). Keyboard support is whatever the Tag buttons provide natively — Tab to reach each chip, Enter/Space to toggle — with no arrow-key roving focus across the group (confirmed).

### Test coverage

Colocated tests exist for all five testable units. Charts assert img-role + accessible name + hidden summary and bar count/label/max-scaling/clamp; the brand preset asserts resolved `rgb(...)` fills per method and override precedence; `PaymentRow` asserts label/detail/amount, `data-method`, brand-icon SVG presence, and icon override; `Filter`/`FilterGroup` assert aria-pressed, labelled group, single toggle-off, and multi accumulation.

Not tested: keyboard activation path for filters is implied via `userEvent.click`, not an explicit Enter/Space key test; `PlatformPerformance` empty/single-point rendering (the `span || 1` and midpoint-x branches) is not exercised; dark-mode and RTL mirroring are not asserted (consistent with the existing suite's scope).

</details>

<details>
<summary>File map</summary>

- `src/components/organisms/platform-performance.tsx` — custom SVG line chart organism (+ test)
- `src/components/organisms/bar-chart.tsx` — generic flex bar chart (+ test)
- `src/components/organisms/payment-method-chart.tsx` — brand-colored BarChart preset, `PAYMENT_METHOD_COLORS` data (+ test)
- `src/components/organisms/payment-row.tsx` — `<li>` payment row with brand icon/amount color data (+ test)
- `src/components/organisms/filter.tsx` — `Filter` (Tag wrapper) + controlled `FilterGroup`
- `src/components/organisms/payment-filter.tsx` — `FilterGroup` preset with next-intl brand labels
- `src/components/organisms/filter.test.tsx` — Filter/FilterGroup behavior
- `src/components/organisms/index.ts` — barrel exports for all new symbols
- `messages/en.json`, `messages/ar.json` — `organisms.dashboard.payment` block, in sync

Full diff: `git show 4c23ece`
</details>
