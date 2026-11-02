# Implementation Plan — Stage 4A (Molecules)

El-Kema Figma → code, stage 4A. Compose 9 molecules from existing atoms/icons + reconcile the existing navbar. Build on stage-1 tokens, stage-2 atoms, stage-3 icons. Do NOT change tokens, fonts, or atom styling.

## Decisions (recorded)

- **(a) Folder & barrel.** Molecules live in a NEW `src/components/molecules/` folder with its own barrel `src/components/molecules/index.ts` (import from `@/components/molecules`). Rationale: the repo already uses a layered split — `ui` = atoms, `shared` = app-wide, `layouts` = page scaffolding. Keeping compositions out of the atoms barrel preserves that separation and matches how the task doc frames the choice. The Navbar is the one exception: it stays in `src/components/shared/navbar.tsx` (it is already there, app-wide, and has live call sites), reconciled in place.
- **(b) FAQ accordion.** Build an **accessible native** disclosure/accordion (header `<button>` with `aria-expanded` + `aria-controls`, a `role="region"` panel labelled by the header, chevron rotation via `data-state`). Rationale: it is a single-row expand/collapse with no roving-tabindex or type-ahead needs, so native markup covers the a11y surface fully; Radix would not meaningfully improve it and the task says prefer native to avoid a new dep. **No dependency added.**
- **(c) No new dependencies.** `Eye` / `EyeOff` for the password toggle come from `lucide-react` (already a dependency). All molecules reuse existing atoms (`Button`, `Input`, `Label`, `Select`, `Card`) and the `@/components/icons` module. Native accordion means `@radix-ui/react-accordion` is NOT added.
- **Figma structural fetches done.** Nav Bar section `451:1352` → main row `451:1151` (bg `#fafafa`, drop-shadow `0 4px 4px #00000040`, padding x24/y12, `justify-between`; nav labels gap 24, paragraph-md 18/28 medium, Disabled text `#a1a1aa`). Search frame `451:1288` (icon button 48px; Search Bar Large 233×50 / Small 233×42). Progress Ring `640:4725` (outer 205×205, ring 152×152, center value, two states). These informed the specs below; structure was adapted to tokens/atoms, never pasted.
- **New type sizes not in tokens.** Figma uses paragraph-md (18/28) for nav labels and paragraph-lg (20/32) for card/accordion headings; these are NOT defined in `globals.css` and tokens must not change. Express them as Tailwind arbitrary utilities: `text-[18px] leading-7` (md) and `text-[20px] leading-8` (lg). Body color `#52525a` (FAQ body) is also not a token — use arbitrary `text-[#52525a] dark:text-zinc-400`. Record these inline with a Figma reference comment.

## Shared conventions (apply to every molecule)

- TypeScript; `"use client"` for any molecule with state/handlers (Selectable Card, Pagination, Accordion, Search, Password toggle, Progress Ring with interactive value, Button Group when it tracks a pressed item). Dropdown Labeled composes the already-client `Select`.
- Styling via `cn` (`@/lib/utils/cn`) + `cva` for variant-bearing components (match `button.tsx` / `tags.tsx` structure: a `xxxVariants` cva export + component). Use `forwardRef` where a DOM ref is idiomatic (follow `input.tsx` / `radio-group.tsx`).
- a11y: real roles/aria, keyboard operable, `focus-visible:ring-ring/50 focus-visible:ring-[3px]` ring token (as atoms do).
- RTL/LTR: logical properties only — `ps/pe/ms/me/start/end`, `rounded-s/e`, never `left`/`right`. Mirror directional arrows with the RTL-aware icon choice, not with `left`/`right`.
- Light + dark: use semantic token utilities (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-primary-light`, …) so dark mode follows the existing `.dark` overrides automatically.
- i18n: every user-facing string via next-intl. Add keys to BOTH `messages/ar.json` and `messages/en.json`, keeping them in sync. Follow navbar/footer usage (`useTranslations` in client components, `getTranslations` in server components).
- Each molecule is a named export re-exported from `src/components/molecules/index.ts`.

## Items

- [ ] 1. Create the molecules folder with an empty barrel and add i18n keys.
      Create `src/components/molecules/index.ts` (starts empty, grows per item). Add a `molecules` namespace to `messages/en.json` and `messages/ar.json` with keys used below: `searchPlaceholder`, `search`, `previous`, `next`, `showPassword`, `hidePassword`, `page` (e.g. "Page {page}"), `progress` (e.g. "{value}% complete"), `expand`, `collapse`. Keep both files in sync.
      Files: `src/components/molecules/index.ts`, `messages/en.json`, `messages/ar.json`
      Verify: `npm run typecheck` passes; `npm run lint` clean (no unused-export error because later items fill the barrel — add exports as each component lands, so run lint after item 11).

- [ ] 2. Selectable Card (`selectable-card.tsx`). `cva` with a `state`/`selected` model mirroring Figma: Default (icon+heading+subheading `text-muted-foreground`, `bg-muted`, `border-muted-foreground`), Hover (`hover:border-primary hover:bg-primary-light hover:text-primary`), Pressed/selected (`text-primary`, `bg-card`, `border-primary`), Disabled. radius `rounded-sm`, padding `px-4 py-2`, border 1, gaps 8 (`gap-2`). Leading icon slot. Controllable `selected` + `value`, reflected to `aria-checked`/`data-state`; `role="radio"` (default) or `role="checkbox"` via a `role` prop; keyboard operable (Enter/Space toggle) and `focus-visible` ring. Heading = `text-sm font-medium`, subheading = `text-xs`.
      Files: `src/components/molecules/selectable-card.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/selectable-card.test.tsx` — new tests pass (see item 11 for tests).

- [ ] 3. Pagination (`pagination.tsx`). Page item: 40×40 (`size-10`), `rounded-full`, `text-xs font-medium`; Default `text-primary bg-card`, Selected `bg-primary text-primary-foreground border border-primary-hover`. Build Prev/Next controls reusing the `Button` atom (`appearance="ghost"`); arrows come from the icon module — use `LeftArrowIcon`/`RightArrowIcon` chosen by logical position so Previous is always inline-start and Next inline-end (RTL-aware; do not hardcode left/right). Props: `page`, `pageCount`, `onPageChange`; render `<nav aria-label>` with page buttons as `aria-current="page"` when selected. i18n labels `previous`/`next`/`page`.
      Files: `src/components/molecules/pagination.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/pagination.test.tsx` — tests pass.

- [ ] 4. FAQ Accordion (`accordion.tsx`), accessible native. Export `Accordion` (container, optional single/multiple open) + `AccordionItem` (header `<button>` with `aria-expanded`, `aria-controls`, and a panel `<div role="region">` with `id` + `aria-labelledby`). Question = `text-[20px] leading-8 font-medium` (paragraph-lg), body = `text-sm text-[#52525a] dark:text-zinc-400` (paragraph-xsm). Surface `bg-card`, `border border-border`, card radius `rounded-lg`. Hover tint `hover:bg-primary-light`. Chevron = `DownArrowIcon` rotating via `data-state=open` (`rotate-180` transition). Keyboard: Enter/Space toggles; `focus-visible` ring. i18n `expand`/`collapse` for the toggle `aria-label` if used.
      Files: `src/components/molecules/accordion.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/accordion.test.tsx` — tests pass.

- [ ] 5. Search molecule (`search.tsx`). Two exports: `SearchButton` (48px icon button reusing `Button` with `size="icon"` sized to `size-12`, `SearchIcon`, i18n `aria-label` = `search`) and `SearchBar` (reuses the `Input` atom via its `startIcon={<SearchIcon />}` slot; `size` prop Large→`md`-ish `h-[50px]` / Small→`h-[42px]` with arbitrary heights to match Figma 50/42; hover tint already provided by Input's `hover:border-primary hover:bg-primary-light`). Placeholder via i18n `searchPlaceholder`. Logical padding only (Input already uses `ps-9`).
      Files: `src/components/molecules/search.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/search.test.tsx` — tests pass.

- [ ] 6. Button Group (`button-group.tsx`). Segmented control reusing `Button` atom tokens. `cva` wrapper that joins buttons: strip inner radii so only the group's leading/trailing ends are rounded using logical radius (`[&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-e-md` and `rounded-none` between), collapse the shared border (negative inline margin / single divider). Track a controlled `value` + `onValueChange`; the active item renders pressed (`active`/`data-state=on` → primary pressed bg). States Default/Hover/Pressed map to the Button atom's existing hover/active classes. `role="group"`; items are `<button aria-pressed>`.
      Files: `src/components/molecules/button-group.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/button-group.test.tsx` — tests pass.

- [ ] 7. Dropdown Labeled (`dropdown-labeled.tsx`). Compose the `Label` atom + `Select` atom (`SelectTrigger`/`SelectContent`/`SelectItem`) in a `flex flex-col gap-2` (gap 8) wrapper. Props: `label`, `id` (wire `Label htmlFor` ↔ trigger `id`), plus pass-through Select props (`value`, `onValueChange`, `children` for items, `size`). No new styling — spacing only.
      Files: `src/components/molecules/dropdown-labeled.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/dropdown-labeled.test.tsx` — tests pass.

- [ ] 8. Password visibility toggle (`password-toggle.tsx`). Small client molecule: a `Button` (`appearance="ghost"`, `size="icon"`) showing `EyeIcon`/`EyeOffIcon` imported from `lucide-react` (not in the icon barrel). Controlled `visible` + `onToggle` (or self-contained with a render-prop/`type` return). `aria-pressed={visible}`, i18n `aria-label` toggling between `showPassword`/`hidePassword`. Intended to be passed as the `Input` atom's `endIcon` on a password field — keep it a standalone button that works inside the input wrapper (note: Input's icon wrapper is `pointer-events-none`, so document that consumers render the toggle outside that wrapper or that SearchBar/password usage positions it with `end-0` absolute + `pointer-events-auto`). Export a `usePasswordToggle` helper returning `{ type, toggle, visible, button }` if that reads cleaner.
      Files: `src/components/molecules/password-toggle.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/password-toggle.test.tsx` — tests pass.

- [ ] 9. Progress Ring (`progress-ring.tsx`). Accessible circular SVG progress. Render two concentric `<circle>`s in an SVG sized to the Figma ratio (outer box `size-[205px]`, ring diameter 152 → `r`, `strokeWidth` tuned to match): track stroke `stroke-muted`, progress stroke `stroke-primary`, `strokeLinecap="round"`, `strokeDasharray`/`strokeDashoffset` from `value` (0–100), rotated -90°. Center shows the value via i18n (`progress` = "{value}% complete" for the accessible name; visible number styled `text-[20px] leading-8 font-semibold` per the molecules doc's paragraph-lg — record the Figma H2 48/60 discrepancy in a comment and follow the doc). Wrapper `role="progressbar"` with `aria-valuenow`/`aria-valuemin={0}`/`aria-valuemax={100}` and `aria-label`. Support two visual states (`variant`/`state` prop) differing by fill as in Figma. RTL-safe (SVG is direction-agnostic; keep text centered). No raster asset — draw with SVG, do not use the Figma asset URLs.
      Files: `src/components/molecules/progress-ring.tsx`, `src/components/molecules/index.ts`
      Verify: `npx vitest run src/components/molecules/progress-ring.test.tsx` — tests pass.

- [ ] 10. Reconcile `navbar.tsx` to Figma `451:1151` while keeping its public API, i18n, locale-switcher, theme-toggle, and Logo. Keep `export async function Navbar()` signature and the `nav`/`common` translation usage. Match Figma: surface `bg-card` (`#fafafa`) with the drop-shadow (`shadow-[0_4px_4px_rgba(0,0,0,0.25)]` or existing `border-b` — keep `sticky top-0 z-40`), padding x24/y12 (`px-6 py-3`), `justify-between`. Nav label links get Default/Hover/Pressed/Disabled states: base `text-[18px] leading-7 font-medium text-muted-foreground`, `hover:text-primary`, active/`aria-current` pressed `text-primary-pressed`, disabled `text-muted-foreground pointer-events-none opacity-...`. Integrate the new `SearchBar` molecule into the desktop row (Figma shows search in the nav). Preserve the mobile `Sheet`, both auth `Button`s, and the Logo in header + sheet. Do NOT change the `routes`/`links` shape. Verify the only call site (`src/app/[locale]/(public)/layout.tsx`) still compiles — API unchanged.
      Files: `src/components/shared/navbar.tsx` (and `messages/*.json` if a new nav label string is required — reuse existing `nav.*` keys first)
      Verify: `npm run typecheck`; `npm run build` (the `(public)` layout renders Navbar).

- [ ] 11. Add component tests for the new molecules following the `button.test.tsx` / `tags.test.tsx` patterns (render + role/aria assertions, `userEvent` for interaction). One `*.test.tsx` per molecule next to it under `src/components/molecules/`. Cover at minimum: Selectable Card selected reflects `aria-checked`/`data-state` and toggles on Enter/Space; Pagination marks the current page `aria-current` and fires `onPageChange`; Accordion toggles `aria-expanded` and reveals the panel; SearchBar renders the search role/placeholder; Button Group reflects pressed item via `aria-pressed`; Dropdown Labeled associates `Label`↔trigger; Password toggle flips `aria-pressed` + `aria-label`; Progress Ring exposes `role="progressbar"` + `aria-valuenow`.
      Files: `src/components/molecules/*.test.tsx`
      Verify: `npm run test` — all new + existing tests pass (baseline is 9 files / 40 tests green).

- [ ] 12. Final full verification from repo root. Fix every failure before done.
      Files: none (gate)
      Verify (all must pass, zero errors): `npm run typecheck`; `npm run lint`; `npm run test`; `npm run build`.

## Digest

Baseline verified today: `npm run test` → 9 files, 40 tests pass. Node 16-style scripts: `typecheck` = `tsc --noEmit`, `lint` = `eslint`, `test` = `vitest run`, `build` = `next build`. Windows PowerShell: chain with `;` not `&&`.

Files touched:

- `src/components/molecules/index.ts` — NEW barrel. Add a named re-export per molecule: `SelectableCard`, `Pagination`, `Accordion`/`AccordionItem`, `SearchButton`/`SearchBar`, `ButtonGroup`, `DropdownLabeled`, `PasswordToggle`, `ProgressRing`. Pattern = `src/components/ui/index.ts`. Covered by each molecule's test importing from the file. Lint flags unused only if a component is declared but not exported — export as you add.
- `src/components/molecules/selectable-card.tsx` — NEW. `selectableCardVariants` (cva) + `SelectableCard` (client, `forwardRef<HTMLButtonElement>`). Pattern = `ui/tags.tsx` (selected→`data-state`, `aria-checked`, `role`). Test: `selectable-card.test.tsx`.
- `src/components/molecules/pagination.tsx` — NEW. `Pagination` (client). Reuses `Button` + `LeftArrowIcon`/`RightArrowIcon` from `@/components/icons`; RTL via logical start/end. Test: `pagination.test.tsx`.
- `src/components/molecules/accordion.tsx` — NEW. `Accordion` + `AccordionItem` (client, native disclosure). `DownArrowIcon` rotate on `data-state`. Test: `accordion.test.tsx`.
- `src/components/molecules/search.tsx` — NEW. `SearchButton` + `SearchBar` reusing `Button` and the `Input` atom (`startIcon`). Test: `search.test.tsx`.
- `src/components/molecules/button-group.tsx` — NEW. `buttonGroupVariants` + `ButtonGroup` (client) reusing `Button` tokens; logical radius on first/last. Test: `button-group.test.tsx`.
- `src/components/molecules/dropdown-labeled.tsx` — NEW. `DropdownLabeled` composing `Label` + `Select` (`flex-col gap-2`). Test: `dropdown-labeled.test.tsx`.
- `src/components/molecules/password-toggle.tsx` — NEW. `PasswordToggle` (client) using `Eye`/`EyeOff` from `lucide-react`; `aria-pressed` + i18n label. Test: `password-toggle.test.tsx`.
- `src/components/molecules/progress-ring.tsx` — NEW. `ProgressRing` SVG, `role="progressbar"`, `aria-valuenow/min/max`. Two `state` variants. Test: `progress-ring.test.tsx`.
- `src/components/shared/navbar.tsx` — MODIFY in place. Keep `export async function Navbar()` and `getTranslations("nav"|"common")`. Change surface/spacing/label states to Figma `451:1151`; add `SearchBar`. Call site `src/app/[locale]/(public)/layout.tsx` (`<Navbar />`, no props) stays valid. No test (server component); covered by `npm run build`.
- `messages/en.json`, `messages/ar.json` — MODIFY. Add `molecules` namespace keys (`searchPlaceholder`, `search`, `previous`, `next`, `showPassword`, `hidePassword`, `page`, `progress`, `expand`, `collapse`); reuse existing `nav.*` for navbar labels. Keep both locales in sync. No direct test; `npm run build` validates message usage.

Patterns confirmed by reading: atoms use `data-slot`, `cn`, `cva`, `focus-visible:ring-ring/50 focus-visible:ring-[3px]`, logical props (`ps/pe/start/end`), and semantic token utilities. Tests use Vitest + Testing Library + `userEvent`, query by role/name, assert `aria-*`/`data-state`. Icon module re-exports lucide under semantic names but does NOT export Eye/EyeOff — import those from `lucide-react` directly.
