# Report table with real semantics + seven distinct dashboard cards (FEAT-004)

FEAT-004 adds the Report data table and six distinct dashboard cards (CoursePerformance, RecentActivityCourse, Testimonials, ExamCard, StudentOverview, StudentData) under `src/components/organisms`, extends the `organisms.dashboard` i18n namespace in both locales, and barrel-exports every new symbol. The Report is a genuine `<table>`/`<thead>`/`<tbody>` with a variant-driven `ReportRow` (course/student/exam/lecture) selecting columns from a per-variant config with i18n-fallback header labels, Badge pass/fail, and icon Buttons for row actions. Every card is prop-driven and composed from existing atoms/molecules/icons with no re-styled copies; the two-state RecentActivityCourse is a single component with a `1|2` variant. All work is committed in `29fae31`.

Watch for: nothing blocking. The implementation satisfies every gating criterion — real table roles (confirmed), composition over duplication (confirmed), single component for the two-state card (confirmed), no left/right usage (confirmed), no raw rgba (confirmed), no new dependency (confirmed), full barrel export (confirmed), all four required tests present (confirmed), and ar/en i18n in sync (confirmed). Two minor, non-blocking notes: the `ExamCardProps.badgeVariant` union advertises an `"error"` value that maps cleanly onto Badge but is cosmetic drift from the Button's `destructive` naming, and `CoursePerformance` has no colocated test (not required by the spec, which lists it as trivial).

**Verdict**: APPROVED

## High-level view

The Report is the load-bearing piece: a `Report` wrapper renders the `<table>` shell with a `<thead>` whose `<th scope="col">` cells come from a `COLUMN_SETS[variant]` config resolved through `useTranslations("organisms")`, and `ReportRow` renders a `<tr>` with a `<th scope="row">` name cell plus variant-gated `<td>`s. `getByRole("table")`, `getAllByRole("columnheader")`, and `getByRole("row", { name })` all resolve against this structure, which the colocated test exercises per variant. Pass/fail reuses the Badge atom (`accent`/`error` + `tone="light"`); row actions reuse the icon Button with i18n-fallback `aria-label`s.

The six cards are each a thin composition over existing primitives — Badge, Button, Avatar, and icon ReactNodes from `@/components/icons` — with no restyled forks. Alignment and spacing are expressed with logical utilities only (`text-start`/`text-end`, `ps`/`pe`-style classes), so each card mirrors in RTL/LTR without branching. Card shadow is the `shadow-card` token throughout; no raw `rgba()` appears in any new file.

The two Figma states that collapse into one component (RecentActivityCourse 1/2) are handled by a single `cva` `variant` that swaps only the accent family and badge color, not by two files. The i18n surface grows four nested groups (`report.*` additions, `coursePerformance`, `recentActivityCourse`, `examCard`) and the key sets are identical between `ar.json` and `en.json`, keeping the parity test green.

<details>
<summary>Issues (2)</summary>

1. **ExamCard badgeVariant naming drift** — the `badgeVariant` prop union includes `"error"`, which maps correctly onto Badge but diverges from the Button atom's `destructive` naming; harmless, worth aligning for consistency if the team standardizes on one term. Non-blocking.
2. **CoursePerformance has no test** — it is the only new card without a colocated test. The spec classifies it as trivial and does not require one, so this is informational, not a gap against the acceptance criteria.

</details>

<details>
<summary>Details</summary>

### Real table semantics in Report

`Report` renders a `<table data-slot="report" data-variant>` wrapped in a horizontally scrollable bordered container, with a `<thead>` holding one `<tr>` of `<th scope="col">` header cells and a `<tbody>` receiving the `ReportRow` children. Headers are driven by `COLUMN_SETS[variant]` — `course` → name/date/students/amount/details/actions, `student` → name/code/grade/date/actions, `exam` → name/examNumber/mark/status/actions, `lecture` → name/attendance/actions — each resolved to a label through `t("dashboard.report.<key>")` unless a caller supplies a `columns` override. This is what makes `getByRole("table")` and the per-variant `getAllByRole("columnheader")` assertions in `report.test.tsx` pass, and the course/exam header-label expectations line up exactly with the en.json strings (`Name`, `Date`, `Students`, `Amount`, `Details`, `Actions`; `Name`, `Exam no.`, `Mark`, `Status`, `Actions`).

`ReportRow` renders the name as a `<th scope="row">`, which is why `getByRole("row", { name: /Algebra/ })` resolves by its row-header text, and the remaining cells are gated by `variant`. The exam variant renders the pass/fail state through the Badge atom (`variant={passed ? "accent" : "error"} tone="light"`), and the trailing actions cell renders view/delete icon Buttons whose `aria-label`s fall back to `t("dashboard.report.view")`/`t("...delete")` — the test clicks them by accessible name and asserts both handlers fire. The action buttons reuse the Button atom with `appearance="ghost"` and `size="icon"`; no bespoke button styling is introduced.

### Composition over duplication across the six cards

Each card is a `forwardRef` + `cn` (+ `cva` where it has variants) composition. Testimonials wraps the Avatar atom and renders the star row as a `role="img"` with an accessible `aria-label`, filling `RateIcon`s against `rating`/`maxRating` — the test asserts both the derived name (`"4 / 5"`) and a custom `ratingLabel`. ExamCard composes Badge + Button and a small internal `InfoChip` for the questions/duration/date pills; its CTA renders as an anchor via `asChild` when `ctaHref` is set, otherwise a button, and falls back to `t("dashboard.examCard.activate")`. StudentOverview and StudentData are compact stat/field rows reusing `PersonIcon` with a `tone` chip variant. None of these re-implement Badge, Button, or Avatar styling; they only arrange existing primitives.

### Logical properties, tokens, and no new dependency

A targeted scan of all seven new component files found no `left`/`right`, no directional margin/padding utilities, and no `text-left`/`text-right`; alignment is entirely `text-start`/`text-end` and flex ordering, so RTL/LTR mirrors without conditional logic. Card shadow uses the `shadow-card` token in Report, Testimonials, ExamCard, and CoursePerformance; no raw `rgba()` literal appears in any new file. All icons (`EditIcon`, `TrashIcon`, `RateIcon`, `BookOpenedIcon`, `PersonIcon`, `MoneyIcon`, `SigmaIcon`, `StopwatchIcon`, `CalendarIcon`, `InfoIcon`) resolve through the existing `@/components/icons` barrel; no charting or other dependency was added (CoursePerformance's completion bar is a plain token-colored flex fill).

### i18n parity

The diff adds `report.{name,examNumber,lecture,view,delete}` plus three new nested groups (`coursePerformance`, `recentActivityCourse`, `examCard`) to both `messages/ar.json` and `messages/en.json` with identical key sets, so the `messages-parity` test stays green. The Report test's header expectations are derived from these exact en.json values.

### Test coverage

Colocated tests exist for the four required components: `report.test.tsx` (table role, per-variant column headers, a course row's cells, exam pass/fail badge, labelled action buttons firing handlers), `testimonials.test.tsx` (labelled article, accessible rating image, custom label), `exam-card.test.tsx` (labelled article with chips, i18n CTA fallback, click handler), and `student-overview.test.tsx` (value/label render, default and requested tone data attribute). Not tested: CoursePerformance, RecentActivityCourse, and StudentData have no colocated tests — the spec lists these as trivial and does not require them, so this is within scope. The commit records `npx vitest run src/components/organisms` at 19 files / 66 tests passing including parity; per instructions the suite was not re-run here.

</details>

<details>
<summary>File map</summary>

- `src/components/organisms/report.tsx` — Report table wrapper + variant-driven ReportRow, per-variant column config, Badge/Button composition.
- `src/components/organisms/report.test.tsx` — table role, per-variant headers, row cells, pass/fail badge, action handlers.
- `src/components/organisms/course-performance.tsx` — wide course KPI row with token-driven completion bar (no chart dep).
- `src/components/organisms/recent-activity-course.tsx` — single component, `1|2` cva variant for the two Figma states.
- `src/components/organisms/testimonials.tsx` — quote card: Avatar + name + role + body + accessible star rating.
- `src/components/organisms/testimonials.test.tsx` — labelled article, rating image name, custom label.
- `src/components/organisms/exam-card.tsx` — exam summary: Badge + info chips + CTA Button (link or button mode).
- `src/components/organisms/exam-card.test.tsx` — chips render, i18n CTA fallback, click handler.
- `src/components/organisms/student-overview.tsx` — compact stat with `tone` chip variant.
- `src/components/organisms/student-overview.test.tsx` — value/label, default + requested tone.
- `src/components/organisms/student-data.tsx` — labelled field row with primary icon chip.
- `src/components/organisms/index.ts` — barrel-exports every new symbol (+ `*Variants`).
- `messages/ar.json`, `messages/en.json` — `organisms.dashboard` extended in sync (report additions + coursePerformance/recentActivityCourse/examCard groups).

Full diff: `git show 29fae31`.

</details>
