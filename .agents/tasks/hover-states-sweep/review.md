# Nav-link hover/active underline brought to Figma, rest of the interactive surface verified untouched

The sweep audited every interactive atom, molecule, and organism card against its Figma Default/Hover/Pressed/Disabled variant and landed exactly one code change to the interactive states: the desktop nav links now render the Figma teal hover-underline and navy active-underline instead of the old color-only `hover:text-primary` / `aria-current:text-primary-pressed`. Every other component was found already matching its Figma variant values on existing tokens and was correctly left alone, so the diff is tiny and surgical. A unit test was added covering the nav underline/active behavior. The two pre-existing working-tree changes (progress-ring `showValueArc` opt-out and its use in the tracking card) are present and untouched.

Watch for:

- The navbar theme/locale change the spec called a "pre-existing uncommitted change to preserve" is no longer uncommitted — it was committed as `a4505f8` (unpushed) rather than left in the working tree (confirmed). It was preserved, not reverted, so the intent held, but it deviates from "leave everything uncommitted." Worth confirming the user is fine with that commit existing.
- Stale docstring in `nav-links.tsx`: the component JSDoc still references `aria-[current=page]:text-primary-pressed`, but the code (correctly) uses `text-primary` per the confirmed Figma `Nav Bar/Label/Pressed = #123458`. Comment-only, non-blocking (likely).

**Verdict**: APPROVED

## High-level view

The nav-link treatment is the whole substance of the change. Figma's `Nav Bar/Label` (451:1034) defines a teal (`#14b8a6`) label + 2px teal bottom border on hover and a navy (`#123458`) label + 2px navy bottom border on the pressed/active state. The implementation maps teal to `--secondary` and navy to `--primary`, reserves the 2px border up front with `border-b-2 border-transparent pb-1` so neither hover nor active shifts layout, and drives the color swap through `transition-colors`. All logical properties, all token-resolved, so light and dark both follow. The active state keeps hanging off `aria-current="page"`, preserving the Server (`navbar.tsx`) / Client (`nav-links.tsx`) split.

The active color correctly changed from `text-primary-pressed` (`#0d2947`) to `text-primary` (`#123458`) because the confirmed Figma `Nav Bar/Label/Pressed` value is `#123458`. That is a real fidelity fix, not churn.

The rest of the sweep is a verification result, not an edit. Button, Input, Checkbox, Radio, Switch, Tags, Select/Dropdown, SelectableCard, accordion, pagination, button-group, search, and the organism cards (OurWorkCard, WhyToStartCard, Levels, Suggestion, Plans, MediaInfoCard, OfferCard, ProgressTrackingCard) were each checked against their Figma variants and left unchanged because they already match. Spot-checking Tags, OurWorkCard, WhyToStartCard, and Levels against the token doc confirms this — their hover/pressed/disabled classes equal the Figma variant hex values via existing tokens, and none appear in the diff.

The recorded verification suite (typegen, typecheck, lint, test, build) all passed, with the test count moving from 165 to 168 for the one new nav-links test file. Per instructions these were not re-run; the recorded results are complete and show no failures.

<details>
<summary>Issues (2)</summary>

1. **Committed "preserve" change** — the navbar theme/locale edit lives in unpushed commit `a4505f8` instead of the working tree; it was preserved not reverted, but confirm the user accepts a commit existing given the "leave uncommitted" rule (possible concern, not a code defect).
2. **Stale JSDoc in nav-links.tsx** — the component comment still says `aria-[current=page]:text-primary-pressed` while the code uses the correct `text-primary`; update the comment to avoid future confusion (likely, comment-only).

</details>

<details>
<summary>Details</summary>

### Nav-link states vs Figma `Nav Bar/Label` (451:1034)

The one substantive change. Old classes were `text-muted-foreground transition-colors hover:text-primary aria-[current=page]:text-primary-pressed` — color-only, no underline, and a pressed color (`#0d2947`) that did not match Figma. New classes:

```
border-b-2 border-transparent pb-1 text-[18px] leading-7 font-medium
text-muted-foreground transition-colors
hover:border-secondary hover:text-secondary
aria-[current=page]:border-primary aria-[current=page]:text-primary
```

Mapping to the confirmed Figma variables, each is exact (confirmed):

- Hover label `#14b8a6` → `hover:text-secondary`; hover border `#14b8a6` weight 2 → `hover:border-secondary` on the `border-b-2`.
- Pressed/active label `#123458` → `aria-[current=page]:text-primary`; active border `#123458` → `aria-[current=page]:border-primary`.
- Disabled `#a1a1aa` is the muted family already carried by the default `text-muted-foreground`.

Reserving the border with `border-transparent` + `pb-1` up front means the 2px underline appearing on hover/active doesn't reflow the row. Logical `border-b` / `pb` only, no left/right (confirmed: the diff contains no `ml-/mr-/pl-/pr-/left-/right-/border-l/border-r`). Colors resolve through `--secondary` / `--primary`, so dark mode follows without extra classes.

The Server/Client split is intact: `nav-links.tsx` remains the `"use client"` child reading `usePathname()` and setting `aria-current="page"`; `navbar.tsx` stays server-rendered. The active match keeps home exact (`pathname === "/"`) and others prefix-based, unchanged.

### Test coverage for the nav underline

`nav-links.test.tsx` (new) mocks `@/lib/i18n/navigation` so the client component renders as a plain anchor with a controllable pathname, then asserts: active link carries `aria-current="page"` plus `aria-[current=page]:text-primary` and `aria-[current=page]:border-primary`; a link exposes `hover:text-secondary`, `hover:border-secondary`, and the reserved `border-b-2 border-transparent`; and the home link matches only on exact path, not as a prefix. That covers the behavior that meaningfully changed.

Not tested: the actual rendered color under a real `:hover`/dark-mode (not unit-testable here; relies on token correctness, which the class-to-token mapping above establishes). Acceptable given hover is not screenshot-able from the static export.

### Verified-already-matching components (no edit, correctly no churn)

Spot-checks against `figma-tokens.md`:

- **Tags** — `false` variant `border-muted-foreground bg-muted text-muted-foreground hover:border-primary hover:bg-primary-light hover:text-primary`; `true` (pressed) `border-primary-foreground bg-primary text-primary-foreground`; disabled via `has-[:disabled]` muted. Equals Figma Default `#a1a1aa`/`#f4f4f5`, Hover `#123458`/`#eff5fa`, Pressed `#fafafa`/`#123458`.
- **OurWorkCard** (753:4774) — `shadow-card` + 1.5px border default, `hover:border-[1.5px] hover:border-border` + `focus-within`, `transition-colors`. Matches the Default/Hover (stroke 1.5 + card shadow) spec.
- **WhyToStartCard** (769:3074) — `hover:border-primary-light-strong hover:shadow-card` + `focus-within` + `transition-shadow`. Matches the shadow-lift hover.
- **Levels** (901:10148) — `hover:border-primary hover:bg-primary` with `group-hover` inverse text/icon and an `inverse` CTA button. Matches the confirmed primary-surface hover payload.

None of these appear in `git diff`, confirming the "don't restyle what already matches" constraint was honored. The remaining listed atoms/molecules/cards follow the same pattern per the notes; the sampled ones all check out, so the blanket "already matches" claim is credible.

### Pre-existing changes preserved

`progress-ring.tsx` gains a `showValueArc` prop (default `true`) that gates the static value arc, and `progress-tracking-card.tsx` passes `showValueArc={false}` so the first-section ring shows only the track + slow rotating spinner (the "stray half-ring" the user asked to remove). Both are still uncommitted in the working tree and untouched by the sweep — preserved as required.

### Verification (recorded, not re-run per instructions)

`implementation-notes.md` records all five suites green on the working tree: typegen PASS, typecheck PASS (0 errors), lint PASS (0 errors), test PASS (41 files / 168 tests, up from 40 / 165 for the new nav test), build PASS. No suite was skipped and none failed. Not independently re-run per the task instruction to trust the recorded results.

</details>

<details>
<summary>File map</summary>

- `src/components/shared/nav-links.tsx` — hover teal underline + active navy underline; active color `primary-pressed` → `primary` to match Figma. (sweep)
- `src/components/shared/nav-links.test.tsx` — NEW: asserts active/hover underline classes and exact-vs-prefix home matching. (sweep)
- `src/components/molecules/progress-ring.tsx` — `showValueArc` prop gating the static arc. (pre-existing, preserved)
- `src/components/organisms/progress-tracking-card.tsx` — passes `showValueArc={false}`. (pre-existing, preserved)

Not in the working tree: `src/components/shared/navbar.tsx` theme/locale controls live in unpushed commit `a4505f8`.

Full diff: `git -C d:\devs\El-Kema-platform diff`; unpushed commit: `git -C d:\devs\El-Kema-platform show a4505f8`.

</details>
