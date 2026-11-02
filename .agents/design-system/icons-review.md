# Figma icon module (stage 3): lucide re-exports + brand SVGs

Stage 3 lands a central, tree-shakeable icon module under `src/components/icons/`. Monochrome UI glyphs are direct named re-exports from `lucide-react` under semantic, Figma-aligned PascalCase names (`SearchIcon`, `GraduationIcon`), so a page pulls in only what it imports. The nine brand/payment/logo marks (Google, Facebook, Apple, Vodafone, Orange, Mastercard, Visa, LogoMark) are hand-authored typed SVG components that preserve their real brand colors, are decorative by default, and promote to `role="img"` + `<title>` when a `title` is supplied. The existing `shared/logo.tsx` now composes the Figma-accurate `LogoMark` while keeping its `{ className }` API and all four call sites untouched. The approach matches the source-of-truth mapping file closely, duplicate Figma names collapse cleanly to one canonical export each, and no downloaded asset files were left behind.

Watch for: one source-of-truth entry is unmapped — the standalone "Users (739:3322) → Users" Figma glyph has no export (confirmed); the name `Users` is consumed by `ParentIcon`. Also the module's semantic names (`PersonIcon`, `ParentIcon`) diverge from the `UserIcon`/`UsersIcon` names existing call sites already import straight from `lucide-react`, so the central module has zero adoption yet (confirmed). Neither blocks shipping.

**Verdict**: APPROVED

## High-level view

The monochrome set is a single `export { Lucide as NameIcon } from "lucide-react"` block. All 63 referenced lucide names resolve in the installed package, so the re-exports typecheck and stay tree-shakeable — exactly the shape the brief asked for over a runtime map. Duplicate Figma names (Add, Rate, Home, Checkmark, Book, Stopwatch, Settings, Library, …) each collapse to one alias with no conflicting export names.

Brand marks share a `BrandIconProps` contract (`className`, `size` default 24, optional `title`) and a consistent a11y pattern: `aria-hidden` when decorative, `role="img"` + `aria-label` + `<title>` when named. Multi-color marks keep baked-in brand hex values rather than `currentColor`; Apple is deliberately kept as `currentColor` (documented as a single-color glyph), and Google makes its gradient ids unique per render with `useId` to avoid cross-instance collisions, which is why it alone is a client component.

`LogoMark` sizes by height and derives width from the real 158.755×163 aspect ratio, so it won't distort. `shared/logo.tsx` swaps the old "EK" placeholder box for it without changing its public API.

The one real gap against the mapping file is coverage, not correctness: the brief's "Users" glyph has no dedicated export. Nothing in the diff refactors existing icon usage onto the module, so current `lucide-react` call sites still bypass it — in scope per "do not change existing atoms," but it means the semantic naming isn't exercised yet.

<details>
<summary>Issues (3)</summary>

1. **Unmapped "Users" glyph** — the source-of-truth file lists a standalone `Users (739:3322) → Users` distinct from `Parent → Users`, but the module exports no `UsersIcon`; `Users` is aliased to `ParentIcon`. Add a `Users as UsersIcon` export (or document that Parent is the canonical home for the Users glyph) so the mapping file is fully covered.
2. **Semantic names diverge from existing usage** — call sites (`course-card.tsx`, `dashboard-sidebar.tsx`, course page) import `UserIcon`/`UsersIcon`/`StarIcon` directly from `lucide-react`; the module names the same glyphs `PersonIcon`/`ParentIcon`/`RateIcon`. Expect confusion when adopting the module; consider aliasing to the already-used names or planning a follow-up migration.
3. **Module has no adoption yet** — nothing imports from `@/components/icons` except the logo and the test, so the tree-shakeability and naming are unverified in real pages. Not a defect for this stage; flag for the next stage that wires screens to the module.

</details>

<details>
<summary>Details</summary>

### Monochrome set: one re-export block, verified against the installed package

`lucide.ts` is a single named re-export from `lucide-react`, aliasing each lucide icon to a Figma-aligned `*Icon` name. I resolved all 63 referenced lucide names against the installed `lucide-react` and none are missing, so every alias is a real icon and the `export { ... } from` block typechecks. This is the tree-shakeable shape the brief asked for: `import { SearchIcon }` pulls only `Search`. The shared `LucideIcon`/`LucideProps` types are re-exported too, which is the right seam for consumers that type an icon-prop.

Duplicate Figma names collapse correctly. The mapping file lists several repeated names — Add (three nodes), Rate (four nodes), Home (two), Checkmark/Check, Book/Book Closed, Openbook/Book Opened, Stopwatch (three), Settings/Settings 2, Library/Library Books, Trending Up (two), Layout Dashboard (two) — and each resolves to exactly one canonical export (`AddIcon`, `RateIcon`, `HomeIcon`, `CheckmarkIcon`, …) with no two aliases sharing a name. The `Add User` variant correctly gets its own `AddUserIcon` (UserPlus) rather than folding into `AddIcon`. Where the file offered a choice (Password → "Lock / KeyRound", Card ID → "IdCard / CreditCard", Checkmark → "Check / CheckCheck"), the first option was taken consistently.

The one coverage gap: the file lists `Users (739:3322) → Users` as a row distinct from `Parent (420:3550) → Users`. The module exposes `Users as ParentIcon` and no `UsersIcon`, so the generic "Users" glyph named in the source of truth has no export of its own. Low impact — the glyph itself is reachable via `ParentIcon` — but it is a literal miss against the mapping file and the cheapest fix is one more alias line.

### Brand marks: shared contract, consistent a11y, real colors

All brand components take `BrandIconProps` — `React.SVGProps<SVGSVGElement>` minus `width`/`height`, plus `size` (default 24) and optional `title` — so `className` and arbitrary SVG props forward while sizing stays owned by the component. The a11y pattern is identical across every mark and matches the brief: no `title` → `aria-hidden="true"` and no role (decorative); `title` set → `role="img"`, `aria-label={title}`, and a rendered `<title>`. The test file exercises both branches on `GoogleIcon`.

Vodafone (single `#E60000`), Visa (`#1434CB`), Orange (`#FF7900` + white), Facebook (`#0866FF` + white), and Mastercard (`#EB001B`/`#F79E1B`/`#FF5A00`) bake brand hex values into fills rather than forcing `currentColor`. Apple is the deliberate exception: kept on `currentColor` with an inline comment explaining the Figma glyph is a single-color mark meant to adapt to light/dark button surfaces — documented intent rather than an oversight.

```
GoogleIcon (client, useId)        — gradient ids namespaced per instance
Facebook/Vodafone/Orange/         — server components, fixed brand hex
  Visa/Mastercard
AppleIcon                         — server component, currentColor (documented)
LogoMark                          — server component, navy/teal brand mark
```

Google is the only client component: it defines three gradients referenced by id, so two instances on one page would otherwise share duplicate `<defs>` ids and cross-contaminate. `useId()` namespaces `radial0`/`radial1`/`linear2` per render, which forces the `"use client"` boundary — the correct fix for the collision.

### LogoMark sizing and the logo.tsx reconciliation

`LogoMark` has a non-square intrinsic canvas (158.755×163). It sizes by height and derives width as `round(size * 158.755 / 163)`, preserving aspect ratio instead of stretching into a square box. The test pins this: `size={163}` → `height=163`, `width=159`, which matches the rounding.

`shared/logo.tsx` previously rendered a hand-rolled "EK" placeholder in a `bg-primary` rounded box at `size-8`. It now renders `<LogoMark size={32} aria-hidden />` beside the site name. The signature stays `Logo({ className })`, it remains a server component, and all four call sites (`navbar`, `footer`, auth layout, dashboard sidebar) pass only children/no props, so nothing downstream breaks. The wordmark still carries the accessible name via the link's `aria-label`.

### Test coverage

`icons.test.tsx` covers the behavioral contract rather than enumerating every icon: a lucide re-export renders with `stroke="currentColor"`; `size`/`className` forward to a lucide glyph; a brand mark bakes its own color (`#EB001B`) instead of inheriting; decorative-by-default hides from AT; `title` promotes to `role="img"` + `<title>`; and `LogoMark` keeps aspect ratio.

Not tested: RTL rendering/mirroring of directional glyphs (Right/Left Arrow, SortBy) — the brief calls out RTL, and nothing asserts these marks behave under `dir="rtl"`. Not tested: dark-mode contrast of the fixed-color brand marks. Not tested: the individual brand components beyond Google/Mastercard (Facebook, Vodafone, Orange, Visa, Apple, and the lucide aliases other than Search/Graduation are untested, though they share the same two code paths). None of these are blocking given the shared contract, but RTL is the one worth a follow-up assertion since it's an explicit requirement.

### Recorded verification and bundled changes

The commit message records `npm run typecheck` (clean), `npm run lint` (0 errors), `npm run test` (40 passed incl. 6 new icon tests), and `npm run build` (success). Per instructions these were not re-run. The one unrelated change in the working tree is a CI workflow edit (`.github/workflows/ci.yml`) adding a "Generate Next types" step before typecheck — unrelated to icons and uncommitted, so outside this review's committed diff; worth committing or reverting separately so it doesn't linger. No downloaded/temporary asset files were committed: the icons tree contains only `.ts`/`.tsx` sources, and the only SVGs in the repo are the pre-existing Next.js defaults under `public/`.

</details>

<details>
<summary>File map</summary>

Full diff: `git -C d:\devs\El-Kema-platform diff HEAD~1...HEAD`

- `src/components/icons/lucide.ts` — semantic PascalCase re-exports of every lucide-mappable Figma glyph; duplicates collapsed to one canonical alias each.
- `src/components/icons/index.ts` — barrel re-exporting `./lucide` and `./brand`.
- `src/components/icons/brand/types.ts` — shared `BrandIconProps` (className, size=24, optional title).
- `src/components/icons/brand/google.tsx` — client SVG, per-instance gradient ids via `useId`.
- `src/components/icons/brand/{facebook,vodafone,orange,visa,mastercard}.tsx` — fixed brand-color SVG marks.
- `src/components/icons/brand/apple.tsx` — single-color mark kept on `currentColor` (documented).
- `src/components/icons/brand/logo-mark.tsx` — navy/teal El-Kema mark, aspect-ratio-preserving sizing.
- `src/components/icons/brand/index.ts` — brand barrel.
- `src/components/icons/icons.test.tsx` — 6 contract tests (color, sizing, a11y, aspect ratio).
- `src/components/shared/logo.tsx` — swaps "EK" placeholder for `LogoMark`; `{ className }` API unchanged.

Uncommitted, unrelated: `.github/workflows/ci.yml` (adds Next type generation before typecheck).

</details>
