# Dashboard sidebar + header reconciled to Figma Side Menu / Header (FEAT-005)

Restyles the dashboard sidebar nav items and the dashboard header to match the Figma Side Menu (952:4135/952:4686) and Dashboard Header (955:4905) without touching the shared layout contract. The sidebar's selected item becomes a navy `bg-primary` surface with inverse text/icon and a `rounded-lg` radius; nav labels move to the `text-paragraph-md` (medium) utility. The header gains a greeting block and an optional `SearchBar` molecule alongside the existing locale/theme controls and user menu, and becomes an `async` Server Component to read translations. `dashboard-shell.tsx`, `dashboard-nav.ts`, and the three `(dashboard)/*/layout.tsx` call sites are untouched, and no dashboard organisms were pulled into the chrome.

Watch for: `DashboardTopbar` changed from a synchronous function to `async` (confirmed) — behavior-preserving here because its only consumer, the Server Component `DashboardShell`, renders it as a JSX child, which the App Router supports for async server components. All blocking criteria were checked against the code and pass.

**Verdict**: APPROVED

## High-level view

The public surface is intact. `DashboardSidebar({ role })` and `DashboardShell({ role, children })` keep their exact signatures, and `DashboardTopbar` keeps a zero-argument signature (the only change is the `async` keyword). `dashboard-nav.ts` is unchanged in shape — the `DashboardNavItem` interface, the `iconName` union, and the per-role `dashboardNav` record are all as before. The three role layouts still call `<DashboardShell role="..." />` and need no edits.

The sidebar selected state meets the spec exactly: `bg-primary` resolves to the navy `#123458` token and `text-primary-foreground` to its inverse `#fafafa`, with `rounded-lg` (16) and a `size-5 shrink-0` icon. Labels use `text-paragraph-md`, whose utility already bakes in `font-weight: 500`, so dropping the separate `font-medium` class is correct rather than a regression. The default/hover state keeps the sidebar-accent surface. Styling is logical-property only (`border-e`, `ms-auto`); no `left/right` and no raw `rgba` were introduced.

The header is aligned to the Figma design as a greeting block + optional search + controls cluster, and stays a Server Component composing client controls — `SearchBar`, `LocaleSwitcher`, `ThemeToggle`, and `UserMenu` remain client components. The `SearchBar size="sm"` call matches the molecule's `"lg" | "sm"` prop and its `className` passthrough. No dashboard organisms were adopted into the layouts.

Two new i18n keys (`dashboard.greeting`, `dashboard.greetingSubtitle`) were added to both `en.json` and `ar.json` in sync.

<details>
<summary>Issues (0)</summary>

No blocking or non-blocking issues. All FEAT-005 acceptance criteria are satisfied.

</details>

<details>
<summary>Details</summary>

### Public API and call sites preserved

`DashboardSidebar({ role }: { role: Role })` and `DashboardShell({ role, children }: { role: Role; children: ReactNode })` are byte-for-byte unchanged in signature (confirmed). `DashboardTopbar()` still takes no arguments; the diff only prepends `async` and swaps the body of the function from a direct return to one preceded by `const t = await getTranslations("dashboard")` (confirmed).

The `async` change is the one behavioral shift worth naming. `DashboardTopbar` is consumed in exactly one place — `dashboard-shell.tsx`, rendered as `<DashboardTopbar />` inside the Server Component `DashboardShell` (confirmed by reading the file). The App Router renders async server components as JSX children without an explicit `await`, so this type-checks and renders unchanged. It would only break if some consumer rendered it in a client component or called it as a plain function; grep found no such consumer (confirmed).

`dashboard-nav.ts` is not in the diff and the file on disk still exports the same `DashboardNavItem` interface (`href`, `labelKey`, `iconName` union) and the `Record<Role, DashboardNavItem[]>` shape (confirmed). The three `(dashboard)/{student,teacher,parent}/layout.tsx` files each still render `<DashboardShell role="..." >{children}</DashboardShell>` and are untouched (confirmed).

### Sidebar selected state matches the Figma Side Menu

The active item class set changed from `bg-sidebar-primary text-sidebar-primary-foreground` with `rounded-md` to `bg-primary text-primary-foreground` with `rounded-lg` (confirmed). `--primary` is `oklch(0.321 0.075 252.4)` annotated `#123458`, and `--primary-foreground` is `oklch(0.985 0 0)` (`#fafafa`), so the selected surface is the navy primary with inverse text/icon (confirmed in `globals.css`). `rounded-lg` maps to the 16px radius called for. The icon moved to `size-5 shrink-0`, and `aria-current="page"` plus `data-state="selected"` were added on the active link, which is a clean accessibility improvement that doesn't alter the public contract.

Labels use `text-paragraph-md`; the old class string carried an explicit `font-medium`, which was removed. That is correct, not a regression: the `.text-paragraph-md` utility in `globals.css` sets `font-size: 18px; line-height: 28px; font-weight: 500` (confirmed), so "paragraph-md medium" is satisfied by the single utility.

### Header composition and search wiring

The header keeps its sticky container and swaps a right-aligned control strip for a three-part layout: a `min-w-0` greeting block (`text-paragraph-md` title + muted subtitle), an `ms-auto` search slot hidden below `md`, and the controls cluster (`LocaleSwitcher`, `ThemeToggle`, `UserMenu`). The `SearchBar` is imported from `@/components/molecules/search`, which resolves to `search.tsx` exporting `SearchBar` (confirmed). The `size="sm"` prop matches the molecule's declared `size?: "lg" | "sm"` and the `className="w-56"` flows through its `cn(...)` passthrough (confirmed), so the call type-checks. All composed controls remain `"use client"` components; the header itself gains no client directive.

### Logical properties and shadow token

A grep of the two edited component files for `rgba`, physical `left/right`, and physical padding/margin utilities returned no matches (confirmed). The header uses `ms-auto`; the sidebar uses `border-e`. The spec's "replace raw rgba shadow with shadow-card" was conditional ("if one is present") — none was present in these files, so nothing needed replacing. The `--shadow-card` token's own `rgba(...)` definition lives in `globals.css` and is pre-existing, outside this diff's scope.

### i18n keys in sync

`dashboard.greeting` and `dashboard.greetingSubtitle` were added to both `messages/en.json` and `messages/ar.json` at the same position in the `dashboard` namespace (confirmed), matching the namespace the topbar reads via `getTranslations("dashboard")`.

### Verification (per commit record, not re-run)

The commit message for `857807b` records `typegen` ok, `typecheck` 0 errors, `lint` 0 errors (1 pre-existing unrelated warning), `test` 131 passed across 36 files, and `build` compiled with 51 static pages. Per the task instruction, these suites were not re-run.

</details>

<details>
<summary>File map</summary>

- `src/components/layouts/dashboard-sidebar.tsx` — nav item restyle: `text-paragraph-md`, `gap-2`, `rounded-lg`, selected `bg-primary/text-primary-foreground`, `size-5` icon, added `aria-current`/`data-state`.
- `src/components/layouts/dashboard-topbar.tsx` — now `async`; added greeting block + optional `SearchBar`; grouped locale/theme/user controls; kept Server Component.
- `src/components/layouts/dashboard-shell.tsx` — unchanged (verified on disk).
- `messages/en.json`, `messages/ar.json` — added `dashboard.greeting` + `dashboard.greetingSubtitle` in sync.

Full diff: `git show 857807b`.

</details>
