# Dependency-free carousel + Home section 1 to three cards

Section 1 (tracking) now renders three `ProgressTrackingCard` organisms (navy/teal/navy) at the Figma 628px width inside a new reusable, dependency-free `Carousel` built on CSS scroll-snap. Sections 2 (courses) and 3 (instructors) move their three `MediaInfoCard`s into the same carousel with prev/next controls beneath, while keeping their existing "اكتشف أكثر" view-all CTAs. The carousel is the only client piece; the three section wrappers stay server components and pass pre-rendered cards as children. Scrolling direction is derived from the computed layout direction rather than hardcoded, buttons are real aria-labelled `<button>`s, and prev/next disable at the start/end by tracking scroll position.

Watch for: RTL scroll sign relies on the negative-`scrollLeft` convention, which is correct on Chromium/Firefox but not all engines (possible); the carousel edge logic can't be exercised under jsdom so the "at end / next enabled→disabled" transition is untested (confirmed).

**Verdict**: APPROVED

## High-level view

The carousel is a single client component that wraps server-rendered cards passed as `children`, keeping all card data server-rendered and satisfying the "only client piece" constraint. Each child is wrapped in a `shrink-0 snap-start` cell with an optional fixed width (628px for tracking, max 410px for courses/instructors), and the scroll region uses `snap-x snap-mandatory` with a hidden scrollbar and `motion-reduce:scroll-auto`.

Direction handling is logical, not hardcoded. The prev/next step is computed from the first child's measured width plus the computed column gap, and its sign flips when `getComputedStyle(el).direction === "rtl"`. The one `left:` in the file is the DOM `ScrollToOptions.left` key with a signed value, not a CSS side. The chevron icons also swap via `rtl:` utilities so the arrows point toward inline-start/end in both directions.

The third tracking card (`chemistry`) and the two carousel aria-label keys (`common.carouselPrevious` / `common.carouselNext`, السابق/التالي) were added to both `ar.json` and `en.json` in sync; the chemistry card reuses the same key shape as math/english. No new dependencies were added (no `package.json` or lockfile change). The unit test covers item rendering, both buttons with aria-labels, the group label, prev-disabled-at-start, and scrollBy-on-next, but can't cover the at-end state because jsdom reports no layout.

<details>
<summary>Issues (2)</summary>

1. **RTL scroll-sign browser assumption** (possible) — the signed-step logic and the `Math.abs(scrollLeft)` edge math assume the negative-`scrollLeft`-in-RTL convention (Chromium/Firefox). On engines using a different RTL scroll model the next/prev direction or edge detection could invert. Verify in an RTL browser matrix or adopt a normalized scroll position if wider support is needed. Non-blocking.
2. **At-end edge transition untested** (confirmed) — the unit test stubs `scrollWidth`/`clientWidth` and only asserts the at-start case (prev disabled, next enabled). The `atEnd` path that disables next is never exercised. Consider adding a case that sets `scrollLeft` to the max to cover it. Non-blocking.

</details>

<details>
<summary>Details</summary>

### Carousel as the sole client boundary

`carousel.tsx` carries the only `"use client"` directive; none of the three `_sections/*.tsx` wrappers were made client components (grep for `use client` in the sections returns nothing). Cards are rendered on the server and handed in through `children`, which `React.Children.toArray` maps into snap cells. This keeps the server/client split the spec asked for: data fetching and translation (`getTranslations` in the sections) stay server-side, and only the scroll/controls interactivity lives on the client.

### Logical direction, no hardcoded sides

The step direction is derived at click time:

```ts
const isRtl = style.direction === "rtl";
const signedStep = (towardsEnd ? step : -step) * (isRtl ? -1 : 1);
el.scrollBy({
  left: signedStep,
  behavior: prefersReducedMotion() ? "auto" : "smooth",
});
```

`left` here is the `ScrollToOptions` property name, carrying a signed delta — not a hardcoded CSS side. The edge detection uses `Math.abs(el.scrollLeft)` against `scrollWidth - clientWidth`, which is direction-agnostic for engines that report negative `scrollLeft` in RTL. That negative-`scrollLeft` convention holds on current Chromium and Firefox; engines with a different RTL scroll origin could invert both the step sign and the at-start/at-end detection. Worth a quick RTL browser check, but not blocking for the supported targets.

The chevrons mirror correctly too: the prev button shows `RightArrowIcon` in LTR and `LeftArrowIcon` in RTL (and vice-versa for next) via `rtl:` utilities, so both buttons point toward the inline start/end regardless of locale.

### Three tracking cards at 628px + i18n parity

`tracking-section.tsx` adds a third `chemistry` entry (`surface: "primary"`, giving navy/teal/navy) and swaps the 2-col grid for `<Carousel itemClassName="w-full max-w-[628px]">`. The `chemistry` tracking copy and the courses/instructors `chemistry` items are present in both `ar.json` and `en.json` with the same key shape as the existing cards (`badge/greeting/body/timeLeft/lesson/grade/cta`), and the new `common.carouselPrevious`/`carouselNext` labels exist in both locales. The spinner + hidden-static-arc behavior lives in the `ProgressTrackingCard` organism, which this commit does not touch, so that committed behavior is preserved.

### Courses & instructors controls beneath

Both sections replace their `grid` with `<Carousel controlsPlacement="below" itemClassName="w-full max-w-[410px]">` and keep the ghost "اكتشف أكثر" view-all `Button`/`Link` below. The Figma "التالي" button is realized as the carousel's below-placed next control (with a symmetric prev for a11y), labelled from `common.carouselNext`/`carouselPrevious`. The `MediaInfoCard` organisms are reused unchanged.

### Test coverage

`carousel.test.tsx` renders three children through `NextIntlClientProvider` (en messages) and asserts: all items render, both prev/next buttons exist with their aria-labels, the scroll region is exposed as a labelled `group`, prev is disabled at the start while next stays enabled, and clicking next calls `scrollBy`. It stubs `scrollBy` and spies on `scrollWidth`/`clientWidth` because jsdom reports zero layout. The consequence is that the `atEnd` branch (next becoming disabled) is never driven — the only edge state tested is at-start. No `tracking-section` test existed, so there was no 2-card assertion to update.

### Verification record

The commit message records all five commands passing: `pnpm run typegen`, `typecheck`, `lint` (0 errors), `test` (42 files, 173 tests), and `build`. Per the task these were not re-run during review. No `package.json` or `pnpm-lock.yaml` change appears in the diff, confirming no new dependencies.

</details>

<details>
<summary>File map</summary>

- `messages/ar.json`, `messages/en.json` — add `common.carouselPrevious`/`carouselNext` (السابق/التالي); chemistry tracking/course/instructor copy present in both.
- `src/components/shared/carousel.tsx` — new dependency-free scroll-snap carousel (the only client component).
- `src/components/shared/carousel.test.tsx` — new unit test (render, buttons, group label, prev-disabled-at-start, scrollBy on next).
- `src/components/shared/index.ts` — export `Carousel` + `CarouselProps`.
- `src/app/[locale]/(public)/_sections/tracking-section.tsx` — three cards (navy/teal/navy) in carousel at 628px.
- `src/app/[locale]/(public)/_sections/courses-section.tsx` — cards into carousel, controls below, view-all CTA kept.
- `src/app/[locale]/(public)/_sections/instructors-section.tsx` — cards into carousel, controls below, view-all CTA kept.

Full diff: `git -C d:\devs\El-Kema-platform show d8c7f7c`

</details>
