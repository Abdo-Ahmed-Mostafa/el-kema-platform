# Implementation Plan — Stage 4B-2 Dashboard Organisms

Builds on stages 1–4B-1 (all committed). Reuse existing atoms (`@/components/ui`), molecules (`@/components/molecules`), icons (`@/components/icons`, incl. brand payment marks), landing organisms (`@/components/organisms`). Do NOT alter the core palette or font. All new organisms live in `src/components/organisms/` and are barrel-exported from `src/components/organisms/index.ts`. Copy is prop-driven with next-intl fallbacks under the existing `organisms` namespace (extend `messages/ar.json` + `messages/en.json` IN SYNC; keep `messages-parity.test.ts` green). TS + `cn` (`@/lib/utils/cn`) + `cva` for state/status variants + `forwardRef` where idiomatic. RTL/LTR via logical properties only (ps/pe/start/end, text-start/end — never left/right). Light + dark. `shadow-card` token for card shadow. Charts are custom SVG/flex from token colors — NO charting dependency. Library + tests only; do NOT adopt into app pages.

Per the spec, run the figma power `get_design_context` (fileKey `y0eOLyKLtTHnJYzOW046WR`) on each listed node id for exact structure, then ADAPT to tokens — never paste raw Figma code. Key node ids were already pulled during planning and summarised per item below; re-pull any whose detail an item lacks.

Windows PowerShell: chain with `;` not `&&`.

## Established facts (verified during exploration)

- `src/app/globals.css` ALREADY defines `--shadow-card` (`0 4px 10px 0 rgba(18,52,88,.12)`), `--radius-card-xl` (24px) → `rounded-card-xl`, and `--text-body` → `text-body`, all wired through `@theme inline`. Status colors all map to existing tokens: secondary (`#14b8a6`)/`secondary-light` (`#ccfbf1`), destructive/error (`#ef4444`)/`destructive-light-strong` (`#fee2e2`), warning (`#df900a`)/`warning-light` (`#fef3c7`), muted (`#a1a1aa`), accent (`#0f766e`). Radii: `rounded-md` = 12, `rounded-lg` = 16.
- Typography is applied with inline arbitrary utilities in existing organisms (e.g. `text-[28px] leading-10 font-bold`, `text-[20px] leading-8 font-medium`). Paragraph md (18/28) and H4 Semibold (28/40, 600) are NOT yet reusable classes — add them additively (see item 1).
- Existing layout chrome: `src/components/layouts/dashboard-shell.tsx` (`DashboardShell({role, children})`), `dashboard-sidebar.tsx` (`DashboardSidebar({role})`, uses `dashboardNav`, `usePathname`, `icons` map, `Logo`), `dashboard-topbar.tsx` (`DashboardTopbar()`), `user-menu.tsx`. Call sites: `src/app/[locale]/(dashboard)/{student,teacher,parent}/layout.tsx` render `<DashboardShell role=…>`. `src/config/dashboard-nav.ts` exports `dashboardNav: Record<Role, DashboardNavItem[]>` and `DashboardNavItem` ({href, labelKey, iconName}). There is NO standalone dashboard header component today — the topbar is the header. Sidebar labels use the `dashboard` namespace, not `organisms`.
- Organism pattern (see `plans-card.tsx`, `leaderboard.tsx`): `React.forwardRef`, `data-slot`, `data-state`, `aria-labelledby` + `React.useId()`, `cva` variants exported alongside the component, `useTranslations("organisms")` for fallback copy.
- Test pattern (see `plans-card.test.tsx`): render inside `NextIntlClientProvider locale="en" messages={en}`, assert roles/labels/variants and handlers. Baseline = 79 tests green; typecheck/typegen green.
- Brand payment icons exist: `VodafoneIcon`, `OrangeIcon`, `MastercardIcon`, `VisaIcon` (+ Google/Facebook/Apple/LogoMark) from `@/components/icons`.

---

- [ ] 1. Add additive typography utilities + extend the `organisms` i18n namespace scaffold.
      Add two reusable text classes WITHOUT touching existing tokens: `text-h4-semibold` (28/40, weight 600) and `text-paragraph-md` (18/28, weight 500). Prefer plain CSS classes in a `@layer components` block in `globals.css` (or small utility classes), named so organisms stop repeating arbitrary values. Keep H4 Bold usage (`text-[28px] leading-10 font-bold`) as-is. Add a nested `organisms.dashboard` key group to BOTH `messages/en.json` and `messages/ar.json` with identical key sets (keys filled per later items; start with the shared ones: `logout`, `search`, `welcome`, `metric.trend`, `subscriptions.{active,expired,cancelled}`, `activity.{title}`, `report.{headers…}`, etc. — add as each component lands, always in both files).
      Files: `src/app/globals.css`, `messages/en.json`, `messages/ar.json`
      Verify: `npm run test -- messages-parity` — parity test passes (identical en/ar organisms key sets). `npm run build` still compiles the CSS.

- [ ] 2. Build `DashboardMetricCard` (Figma 965:5276, states Default/Hover).
      `forwardRef<HTMLDivElement>`, `cva` state variant (default border `border`, hover border `border-primary-hover` + `shadow-card`). Layout: top row = optional trend `Badge variant="secondary"` (secondary-light) on the start + metric label (`text-body`, paragraph-sm) + navy icon chip (32px, `rounded-sm`, `bg-primary`, inverse icon via `icon`/`iconSwap` prop). Value row = `text-h4-semibold text-accent`. `rounded-lg` (16) + `p-6` (24). Props: `label`, `value`, `trendLabel?`, `icon?: ReactNode`, `state?`. All copy prop-driven. Logical props only.
      Files: `src/components/organisms/dashboard-metric-card.tsx`, barrel `src/components/organisms/index.ts`
      Verify: add `dashboard-metric-card.test.tsx` (renders value/label, hover state data attr, optional badge); `npx vitest run src/components/organisms/dashboard-metric-card` passes.

- [ ] 3. Build `Subscriptions` status card (Figma 1049:12356, states Active/Expired/Cancelled).
      `forwardRef`, `cva` `status` variant mapping Active→secondary (`bg-secondary-light border-secondary text-secondary`), Expired→error (`bg-destructive-light-strong border-destructive text-destructive`), Cancelled→warning (`bg-warning-light border-warning text-warning`). Header row = label (paragraph-sm medium, status color) + status-colored icon chip (32px rounded-sm, status surface, inverse icon). Value row = `text-h4-semibold` in status color. `rounded-lg` + `p-6` + `border`. Props: `label`, `value`, `status`, `icon?`.
      Files: `src/components/organisms/subscriptions.tsx`, barrel
      Verify: `subscriptions.test.tsx` asserts status data attr + value; `npx vitest run src/components/organisms/subscriptions` passes.

- [ ] 4. Build `HighlightCard` (Figma 1016:8697, states Students/Courses).
      One component with a `variant` (students/courses) differing only by icon + accent; ~400x83 compact row: icon chip + number (paragraph-lg/H4) + label (`text-body`). Props: `value`, `label`, `icon?`, `variant?`. `rounded-lg`, `p-6`, `border`, optional `shadow-card`.
      Files: `src/components/organisms/highlight-card.tsx`, barrel
      Verify: `highlight-card.test.tsx` (value + label render); vitest passes.

- [ ] 5. Build `ActivityItem` feed row (Figma 999:7499, states Secondary/Error/Warning).
      `forwardRef<HTMLLIElement>` rendering an `<li>` (feed semantics — consumers wrap in `<ul role="list">`). `cva` `status` variant: leading status dot (`rounded-md` 12px bar, status surface) at the block start, text block (name paragraph-sm medium `text-primary`, meta row = action text in status color + separator dot + time in muted), trailing icon chip (32px, status-light surface, status-colored icon). Props: `name`, `action?`, `time?`, `status`, `icon?`, `showDot?`. Logical props (start/end).
      Files: `src/components/organisms/activity-item.tsx`, barrel
      Verify: `activity-item.test.tsx` (name/time render across statuses, list item role); vitest passes.

- [ ] 6. Build custom SVG line chart `PlatformPerformance` (Figma 979:6234, State=Revenue).
      Card header = `Badge` (primary-light) + title (paragraph-sm medium, primary) + navy icon chip. Body = a self-contained responsive SVG line chart built from a `data: {label,value}[]` prop + optional `yTicks`: horizontal gridlines (`stroke-border`), a polyline/path in `stroke-primary` (or `stroke-secondary`), x-axis month labels (`text-body` xxsm). a11y: wrap SVG with `role="img"` + `aria-label` summary (e.g. "Revenue trend, Jan–Dec") and a visually-hidden text summary. NO chart library. Props: `title`, `data`, `badgeLabel?`, `icon?`. `rounded-lg`, `p-6`, `shadow-card`, `border`.
      Files: `src/components/organisms/platform-performance.tsx`, barrel
      Verify: `platform-performance.test.tsx` (renders an `img`-role figure with aria-label, renders each label); vitest passes.

- [ ] 7. Build custom SVG/flex bar charts `PaymentMethodChart` (Figma 1030:10140) and generic `BarChart` (Figma 1042:12226) as ONE `BarChart` component with an optional per-bar color prop; `PaymentMethodChart` is a thin preset wiring brand colors (V.Cash `#e60000`, O.Cash `#ff7900`, Mastercard `#000`, Mezza `#007300`, Visa `#1434cb`) via props (brand colors are data, not theme tokens — keep them in the consumer/preset, not globals.css).
      Bars = flex columns, each `rounded-sm` filled bar whose height scales to `value/max`, a value label above and a category label below (`text-body` xxsm). Y-axis tick labels optional. a11y: `role="img"` + `aria-label` summary; each bar has an accessible name. Props: `data: {label,value,color?}[]`, `title?`, `max?`, `formatValue?`. Card chrome identical to item 6.
      Files: `src/components/organisms/bar-chart.tsx`, `src/components/organisms/payment-method-chart.tsx`, barrel
      Verify: `bar-chart.test.tsx` (bar count, labels, max scaling clamps height 0–100%), `payment-method-chart.test.tsx` (brand presets render); vitest passes.

- [ ] 8. Build `PaymentRow` (Figma 1049:12711, Vodafone/Orange/Visa).
      A payment-method row: leading brand icon (`VodafoneIcon`/`OrangeIcon`/`VisaIcon`/`MastercardIcon` chosen by a `method` prop mapping, or `icon` override), method name, optional masked number + amount. `forwardRef<HTMLLIElement>` `<li>` for list use. Props: `method?: "vodafone"|"orange"|"visa"|"mastercard"`, `icon?`, `label`, `detail?`, `amount?`. Logical props.
      Files: `src/components/organisms/payment-row.tsx`, barrel
      Verify: `payment-row.test.tsx` (renders brand icon by method + label); vitest passes.

- [ ] 9. Build filter components `Filter`, `FilterGroup`, `PaymentFilter` (Figma 1027:9355 / 995:7467 / 1032:10384) reusing the `Tag` atom and `ButtonGroup` molecule.
      `Filter` = a single selectable chip wrapping `Tag` with a `selected` prop (pressed state). `FilterGroup` = a labelled, keyboard-navigable group of `Filter` chips (compose `ButtonGroup` semantics; `role="group"` + `aria-label`, single/multi select via `value`/`onValueChange`). `PaymentFilter` = a `FilterGroup` preset for payment methods (brand labels). Do NOT restyle Tag/ButtonGroup. Props prop-driven; copy via i18n fallback.
      Files: `src/components/organisms/filter.tsx` (exports Filter + FilterGroup), `src/components/organisms/payment-filter.tsx`, barrel
      Verify: `filter.test.tsx` (selecting a chip toggles aria-pressed / fires onValueChange); vitest passes.

- [ ] 10. Build `Report` table (Figma 1126:19055, states Course/Student/Exam/Lecture + Student Header).
      Use real table semantics: a `Report` wrapper rendering `<table>` with `<thead>`/`<tbody>`, plus a `ReportRow` row component with a `variant` (course/student/exam/lecture) selecting which columns render. Columns observed per variant: Course (course name, date, students count, money, details, actions eye/trash); Student (student name, code, grade, date, actions); Exam (quiz name, exam number, mark, fail badge, actions); Lecture (system/lecture name, attendance time + icons, actions). Header row driven by `columns` config per variant. Use `Badge` for pass/fail (error badge) + `Button`(icon) for actions. All headers/cells prop-driven; i18n fallbacks for default header labels. Logical alignment (text-start/end). Keep it data-driven: `Report({variant, columns?, rows})` or compose `ReportRow` under a caller-provided table — pick the table-wrapper approach for correct semantics and expose both the header and row.
      Files: `src/components/organisms/report.tsx`, barrel
      Verify: `report.test.tsx` (renders `table` role, column headers per variant, a row's cells, action buttons); vitest passes.

- [ ] 11. Build the additional distinct cards, composing atoms/molecules; pull each node's `get_design_context` first. - `CoursePerformance` (1008:7826) — course KPI card (title + metric + small chart/progress; reuse `ProgressRing` or the item-6/7 chart if it shows one). - `RecentActivityCourse` (1089:15840, states 1/2) — course activity card; one component with a `variant`. - `Testimonials` (711:9325) — quote card: avatar + name + role + body + rating (`RateIcon`). - `ExamCard` (1166:23315) — exam summary card (title, date, duration, status badge, CTA). - `StudentOverview` (1174:24931) — student profile summary (avatar, name, stats grid). - `StudentData` (1173:24352) — student data card (labelled field rows).
      Build each as prop-driven, forwardRef where idiomatic, i18n fallbacks, logical props, light+dark. If any two are visually identical with different data, build ONE with variants.
      Files: `src/components/organisms/course-performance.tsx`, `recent-activity-course.tsx`, `testimonials.tsx`, `exam-card.tsx`, `student-overview.tsx`, `student-data.tsx`, barrel
      Verify: unit tests for the non-trivial ones (`testimonials.test.tsx`, `exam-card.test.tsx`, `student-overview.test.tsx` at minimum); `npx vitest run src/components/organisms` passes.

- [ ] 12. Reconcile the existing layout chrome to the Figma Side Menu + Header, preserving public API. - `dashboard-sidebar.tsx`: keep signature `DashboardSidebar({role})`, keep `dashboardNav`/`DashboardNavItem`/`iconName` map/`usePathname`/`Logo`. Restyle nav items to the Figma Side Menu: paragraph-md medium, icon-text gap 8, selected = `bg-primary text-primary-foreground` fill with `rounded-lg` (16) and inverse icon (replace current `rounded-md`/`text-sm` + `bg-sidebar-primary`), hover = subtle surface. Keep the `active` logic. Do NOT change `dashboard-nav.ts` shape or the `dashboard` i18n namespace it reads. - `dashboard-topbar.tsx` (the header): align to Figma Dashboard Header (955:4905) — greeting block (`welcome`) + optional search (reuse `SearchBar` molecule) + existing LocaleSwitcher/ThemeToggle/UserMenu + avatar; keep `DashboardTopbar()` signature and keep it a Server Component composing the client controls. Replace any raw rgba shadow with `shadow-card` if present. - Leave `dashboard-shell.tsx` structure intact (still composes sidebar + topbar). Keep all three `(dashboard)/*/layout.tsx` call sites working unchanged.
      Files: `src/components/layouts/dashboard-sidebar.tsx`, `src/components/layouts/dashboard-topbar.tsx` (+ `messages/{ar,en}.json` if new `dashboard`/`organisms` keys needed, in sync)
      Verify: `npm run typecheck` (call sites still type-check), `npm run test` (parity + any layout tests green), `npm run build`.

- [ ] 13. Final barrel, i18n sync, and full verification.
      Ensure every new organism (+ its `*Variants` where exported) is exported from `src/components/organisms/index.ts`. Confirm `messages/ar.json` and `messages/en.json` have identical `organisms` key sets. Remove any temp files.
      Files: `src/components/organisms/index.ts`, `messages/en.json`, `messages/ar.json`
      Verify (from repo root, ALL must pass at zero errors): `npm run typegen`; `npm run typecheck`; `npm run lint`; `npm run test` (existing 79 stay green + new tests pass); `npm run build`. Then commit to main.

## Digest

Baseline verified during planning: `npm run typegen` + `npm run typecheck` exit 0; `vitest list` = 79 tests; build not re-run (no changes yet). Commands: build `npm run build`, typecheck `npm run typecheck` (after `npm run typegen`), lint `npm run lint`, tests `npm run test` (or scoped `npx vitest run src/components/organisms`).

Files to create (all new organisms + tests under `src/components/organisms/`):

- `dashboard-metric-card.tsx` (+ `.test.tsx`) — item 2
- `subscriptions.tsx` (+ `.test.tsx`) — item 3
- `highlight-card.tsx` (+ `.test.tsx`) — item 4
- `activity-item.tsx` (+ `.test.tsx`) — item 5
- `platform-performance.tsx` (+ `.test.tsx`) — item 6
- `bar-chart.tsx` (+ `.test.tsx`), `payment-method-chart.tsx` (+ `.test.tsx`) — item 7
- `payment-row.tsx` (+ `.test.tsx`) — item 8
- `filter.tsx` (+ `.test.tsx`), `payment-filter.tsx` — item 9
- `report.tsx` (+ `.test.tsx`) — item 10
- `course-performance.tsx`, `recent-activity-course.tsx`, `testimonials.tsx` (+ `.test.tsx`), `exam-card.tsx` (+ `.test.tsx`), `student-overview.tsx` (+ `.test.tsx`), `student-data.tsx` — item 11

Files to modify:

- `src/app/globals.css` — add `text-h4-semibold` + `text-paragraph-md` component classes (additive; existing `--shadow-card`/`--radius-card-xl`/`--text-body` already present). Covered by: build compiles; organisms render.
- `src/components/organisms/index.ts` — barrel-export every new organism + variants. Covered by: typecheck + any import in tests.
- `src/components/layouts/dashboard-sidebar.tsx` — restyle nav items to Figma Side Menu, preserve `DashboardSidebar({role})` + `dashboardNav` usage. Covered by: typecheck of the three `(dashboard)/*/layout.tsx` call sites + build.
- `src/components/layouts/dashboard-topbar.tsx` — align to Figma Header, preserve `DashboardTopbar()` signature. Covered by: build + typecheck.
- `messages/en.json` + `messages/ar.json` — extend `organisms` namespace IN SYNC. Covered by: `messages-parity.test.ts` (must stay green).

Test coverage: each non-trivial organism gets a colocated `*.test.tsx` following `plans-card.test.tsx` (render in `NextIntlClientProvider` with `en.json`, assert role/label/variant/handler). `messages-parity.test.ts` guards en/ar sync. Existing 79 tests must remain green.

Figma nodes (fileKey `y0eOLyKLtTHnJYzOW046WR`) — re-pull with `get_design_context` for any detail an item lacks: Side Menu 952:4135 (+section 952:4686), Header 955:4905, Metric 965:5276, Subscriptions 1049:12356, Highlights 1016:8697, Platform Performance 979:6234, Payment Method Chart 1030:10140, Bar Chart 1042:12226, Payment 1049:12711, Activity 999:7499, Report 1126:19055, Filters 1027:9355/995:7467/1032:10384, Course Performance 1008:7826, Recent Activity Course 1089:15840, Testimonials 711:9325, Exam Card 1166:23315, Student Overview 1174:24931, Student Data 1173:24352.
