# Stage 4A molecules: 9 compositions plus navbar reconciliation

Stage 4A builds a new `src/components/molecules/` layer (barrel at `@/components/molecules`) with nine components composed from the existing atoms, icons, and tokens — Selectable Card, Pagination, Button Group, Dropdown Labeled, Password Toggle (FEAT-001), FAQ Accordion, Search, Progress Ring (FEAT-002) — and reconciles `shared/navbar.tsx` to Figma `451:1151` with the `SearchBar` wired in (FEAT-003). The work spans four commits (`a80c33b`, `0541d19`, `2c94029`, `4b73709`), the last addressing a prior review pass. Every component reuses real atom APIs (`Button` appearance/size, `Input` `startIcon`/size, `Select`), adds `molecules.*` i18n keys to both locales in sync, and ships a colocated test. The navbar keeps its `export async function Navbar()` signature and all server-side translation usage; active-route marking was extracted into a `NavLinks` client child so the Server Component boundary is preserved. The coder's recorded verification (final commit) is typecheck 0 errors, lint 0 errors (1 pre-existing unrelated warning), test 17 files / 65 tests, build success.

Watch for: two dead i18n keys (`molecules.expand` / `molecules.collapse`) that no longer have a referencing call site after the accordion dropped its toggle aria-label — confirmed. SelectableCard advertises `role="radio"` but implements a toggle, not the full radio keyboard contract — confirmed, acceptable at the primitive layer but worth a consumer note. Pagination renders every page with no truncation — confirmed, a scalability note only since nothing adopts it yet. Navbar surface uses `bg-card/80` + backdrop blur rather than Figma's solid `#fafafa` — confirmed, a documented deliberate deviation.

**Verdict**: APPROVED

## High-level view

The molecules sit in their own layer rather than the atoms barrel, which matches the repo's existing `ui` / `shared` / `layouts` split; the navbar is the one component reconciled in place because it already lives in `shared` and has a live call site. Every composition leans on an atom's public API instead of redefining styling — Search wraps `Input` and only overrides height to hit Figma's 50/42, Button Group reuses `buttonVariants` and collapses borders with logical radius, Dropdown Labeled is just `Label` + `Select` with a wired `htmlFor`/`id`. No new dependency was added; `Eye`/`EyeOff` come from `lucide-react` directly and the accordion is a native disclosure rather than Radix.

RTL correctness is handled with logical properties throughout (`ps/pe`, `rounded-s/e`, `-ms-px`, `start/end`), and the two directional cases that need mirroring — the pagination arrows — flip via `rtl:rotate-180` on logically-named icons rather than any `left`/`right` class. Accessibility is real across the set: `role="progressbar"` with valuenow/min/max on the ring, `aria-expanded`/`aria-controls` plus a labelled `role="region"` on the accordion, `aria-current="page"` on pagination and the active nav link, `aria-pressed` on toggle buttons, and the shared `focus-visible:ring-ring/50 focus-visible:ring-[3px]` token on every interactive surface.

The navbar reconciliation preserves the full public contract (no-arg async component, `nav`/`common` translations, LocaleSwitcher, ThemeToggle, Logo in header and sheet, both auth buttons, mobile Sheet) and the sole call site in the public layout is untouched. Active-route state was moved into a client child so the Server Component stays a Server Component — a clean solution to the one real tension in the task.

The known gaps are all minor and none block: two unused translation keys, a radio role that only implements toggle semantics, an untruncated pagination list, and a translucent navbar surface that departs slightly from the solid Figma fill by design. Molecules were not adopted into any app page beyond the navbar, as the task required.

<details>
<summary>Issues (4)</summary>

1. **Dead i18n keys** — `molecules.expand` and `molecules.collapse` exist in both `ar.json` and `en.json` but have no call site after the accordion dropped its aria-label; remove them from both locales or wire them to a visible control.
2. **Radio role vs toggle semantics** — `SelectableCard` sets `role="radio"` but handles only Enter/Space toggle, with no radiogroup container or arrow-key roving; document that consumers must supply the group semantics, or default the role to one the single-element behavior satisfies.
3. **Pagination has no truncation** — it renders one button per page for the full `pageCount`, so a large count yields an unbounded row; add ellipsis/windowing before adopting it on a page with many pages.
4. **Navbar surface deviates from Figma fill** — `bg-card/80` + `backdrop-blur-sm` instead of the solid `#fafafa` the Figma node specifies; confirm the translucent sticky treatment is intended or switch to the solid fill.

</details>

<details>
<summary>Details</summary>

### Composition over duplication

The strongest property of this set is that it adds no styling the atoms already own. `SearchBar` renders `<Input type="search" startIcon={<SearchIcon />}>` and overrides only the height (`h-[50px]` / `h-[42px]`) because the Input atom's `size` tops out at 46px — the hover tint and `ps-9` logical padding ride along from the atom. `ButtonGroup` builds each segment from `buttonVariants({ variant, appearance, size })` and only adds the group geometry: `[&>*:not(:first-child)]:-ms-px` to collapse the shared edge and `[&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-e-md` for logical end rounding. `DropdownLabeled` is purely `Label` + `Select` in a `flex-col gap-2` wrapper with `htmlFor`/`id` wired, no new visual tokens. This keeps the atom as the single source of truth for each surface.

### Accordion: native disclosure, and the aria-label fix

The accordion is a native disclosure group with a React context tracking open values and a `type="single" | "multiple"` mode. Each row is a real `<button>` carrying `aria-expanded` and `aria-controls`, paired with a `role="region"` panel that is `aria-labelledby` the trigger and `hidden` when closed. The prior review flagged a redundant trigger `aria-label`; the fix commit removed it so the question text itself names the button, which the test asserts (`getByRole("button", { name: "Question A" })`). The chevron rotates via `data-[state=open]:rotate-180` with `data-state` forwarded onto the icon.

One leftover: the `molecules.expand` / `molecules.collapse` keys were added for that aria-label and are now unreferenced in both locales. A grep across `src/**/*.tsx` finds no usage. They are harmless (next-intl does not error on unused keys and the locales stay in sync) but should be removed or put to use.

### Pagination: RTL arrows and scaling

Previous/Next reuse the `Button` atom (`ghost`, `size="icon"`), and the arrows are chosen by logical intent: `LeftArrowIcon` for Previous, `RightArrowIcon` for Next, each with `rtl:rotate-180`. Because `LeftArrowIcon` is lucide's `ChevronLeft`, in LTR it points toward inline-start (left) and the RTL rotation flips it to point right, which is inline-start under RTL — correct in both directions without any hardcoded `left`/`right`. The current page carries `aria-current="page"` and each page button gets a `Page N` accessible name; the `<nav>` landmark is labelled via the new `molecules.pagination` key rather than echoing a page string, which the last review requested.

The list renders one button for every page in `1..pageCount` with no windowing. For a realistic page count this produces a very wide control. Since no page adopts Pagination yet, this is a scalability note to resolve before real use, not a defect in the molecule layer.

### Navbar reconciliation and the Server Component boundary

The reconciliation keeps the entire public contract intact: the no-arg `export async function Navbar()`, both `getTranslations` calls, LocaleSwitcher, ThemeToggle, Logo in both the header and the sheet title, the two auth buttons, and the mobile Sheet. The `links` array keeps its `{ href, label }` shape and the sole call site (`(public)/layout.tsx`, `<Navbar />` no props) is unchanged, so the API-preservation requirement holds. The real tension — Figma's Pressed state needs the current pathname, which is client-only — is resolved by extracting `NavLinks` into a `"use client"` child that reads `usePathname` and sets `aria-current="page"`, driving the `aria-[current=page]:text-primary-pressed` class. Navbar itself stays a Server Component. Nav labels use the arbitrary `text-[18px] leading-7` (paragraph-md) that the plan calls out as intentionally not a token.

The surface is `bg-card/80` with `backdrop-blur-sm` and a raw `shadow-[0_4px_4px_rgba(0,0,0,0.25)]`, where Figma specifies solid `#fafafa`. The translucency/blur is carried over from the original sticky navbar and documented in a comment; the raw shadow is annotated as a future `--shadow-*` token candidate. Both are deliberate and noted, so this is a fidelity deviation to confirm rather than a drift to fix. `SearchBar size="sm"` is placed in the desktop row behind an `lg:flex` gate.

### SelectableCard radio semantics

The card is a `forwardRef<HTMLButtonElement>` with a cva `selected` variant mapping the Figma Default/Hover/Pressed/Disabled states to semantic tokens, reflecting selection to both `aria-checked` and `data-state`, and toggling on Enter/Space with `focus-visible` ring. The gap is the ARIA contract: `role="radio"` (the default) implies membership in a `radiogroup` with arrow-key roving and Space-to-select semantics, but the component implements a standalone Enter/Space toggle. As a composable primitive that's a reasonable division of labor — the consumer supplies the group — but it should be documented, or the default role changed to one whose single-element keyboard behavior the component actually satisfies. The `role="checkbox"` path, by contrast, matches the implemented toggle exactly.

### i18n sync and test coverage

The `molecules` namespace was added to both `messages/ar.json` and `messages/en.json` with the same key set (`previous`, `next`, `page`, `pagination`, `showPassword`, `hidePassword`, `search`, `searchPlaceholder`, `progress`, `expand`, `collapse`), keeping the locales in sync. Tests cover the behavioral contract of each molecule: SelectableCard's `aria-checked`/`data-state` and Enter/Space toggles and the checkbox role; Pagination's `aria-current`, page/Next click handlers, and disabled Previous; Accordion's `aria-expanded`, panel reveal, `aria-labelledby`, keyboard, and single-open mode; SearchBar's searchbox role and placeholder override; ButtonGroup's `aria-pressed` and `onValueChange`; DropdownLabeled's label↔trigger association; PasswordToggle's label/`aria-pressed` flip and click; ProgressRing's progressbar role, aria-value attributes, accessible name, and clamping.

Not tested: pagination behavior at large `pageCount` (no truncation case exists to test); the RTL arrow flip is not asserted (it's a CSS-only `rtl:` class, hard to assert in jsdom); the navbar is a Server Component with no unit test and is covered only by `next build`.

### Bundled CI change

The uncommitted working-tree change adds a `Generate Next types` step (`npm run typegen`) to `.github/workflows/ci.yml` before typecheck, with placeholder env URLs. It is unrelated to the molecules work and currently uncommitted. It's a sensible CI fix (tsc needs the generated `.next/types`), but it should land as its own commit rather than riding along with stage 4A.

</details>

<details>
<summary>File map</summary>

- `src/components/molecules/index.ts` — new barrel re-exporting all nine molecules + variants/helper.
- `src/components/molecules/selectable-card.tsx` — radio/checkbox-style selectable card (cva + forwardRef).
- `src/components/molecules/pagination.tsx` — page buttons + RTL-aware Prev/Next.
- `src/components/molecules/button-group.tsx` — segmented control over `buttonVariants`.
- `src/components/molecules/dropdown-labeled.tsx` — `Label` + `Select` composition.
- `src/components/molecules/password-toggle.tsx` — Eye/EyeOff ghost toggle + `usePasswordToggle`.
- `src/components/molecules/accordion.tsx` — native disclosure `Accordion` + `AccordionItem`.
- `src/components/molecules/search.tsx` — `SearchButton` (48px) + `SearchBar` (50/42) over `Input`.
- `src/components/molecules/progress-ring.tsx` — SVG `role="progressbar"` ring, default/inverse.
- `src/components/molecules/*.test.tsx` — one colocated test per molecule.
- `src/components/shared/navbar.tsx` — reconciled surface/spacing/label states; SearchBar integrated; API preserved.
- `src/components/shared/nav-links.tsx` — new client child setting `aria-current` on the active route.
- `messages/ar.json`, `messages/en.json` — `molecules` namespace added in sync.
- `.agents/tasks/stage-4a-molecules/features/FEAT-001.json` — feature tracking.
- `.github/workflows/ci.yml` — (uncommitted) adds Next typegen step before typecheck; unrelated to stage 4A.

Full diff: `git -C d:\devs\El-Kema-platform diff 853aab3 HEAD`

</details>
