# Implementation Plan — El-Kema public Home Page at "/"

Target: replace the placeholder `src/app/[locale]/(public)/page.tsx` (the `/` route) with the Home Page (Figma frame "Home Page", node `624:3480`), composed from the design system via thin section wrappers under `src/app/[locale]/(public)/_sections/`. The `(public)` layout already renders the sticky Navbar + Footer — do NOT add either. Keep the existing `generateMetadata` (uses `home.heroTitle` / `home.heroSubtitle`) working.

## Design decisions (grounded in the frame + existing code)

These are decisions the implementer must not re-open:

1. **The named organisms in the task brief do NOT match the Home frame.** I pulled `get_design_context` on `624:3480` and read every section subtree. The course cards (`624:3506/3507/3508`), instructor cards (`656:7092/7134/7049`), and offer/suggestion cards (`679:7877`, `679:7648`) are RICH token-styled cards that have no matching existing organism:
   - `OurWorkCard` is image + badge + title + body + ghost CTA — it has **no** price/discount/rating/meta-row API. It does not fit the Course Card.
   - `InstructorHeroCard` is a horizontal portrait + bio + badges + filled CTA — it does not fit the vertical Instructor Card (image-on-top, 3 meta rows, outlined CTA, floating rating badge).
   - `Suggestion` is an icon + title + body + CTA row with no gradient, no bleeding illustration, no badge — it does not fit the gradient offer cards.
   - `src/features/courses/components/course-card.tsx` is a catalog card bound to `CourseListItem` + the `courses` namespace + lucide icons; it is not the Figma card either.
     Per the brief's own rule ("Only build a NEW organism if a section genuinely has no matching organism AND is reusable; prefer composing existing ones"), sections 2–4 need **new small, reusable organisms**. These are added to `src/components/organisms/` and composed by the section wrappers — the wrappers stay thin. This is a deviation from the brief's suggested mapping and is driven by Figma fidelity (the brief says Figma is the source of truth and to verify each mapping).

2. **Section 1 has THREE progress cards in Figma** (navy `696:8132`, teal `650:5511`, navy `629:3952`), each 628px wide, each with a 25% ring, a primary/accent Badge, title "أهلًا بعودتك!", body, three meta rows (time left / lesson X of Y / grade), and an inverse-filled "متابعة التعلّم" CTA. The brief said "two". Follow Figma: render the three as data-driven items. No tracking-progress organism exists, so compose the existing `ProgressRing` molecule + a new `ProgressTrackingCard` organism (gradient surface). ProgressRing stays unchanged.

3. **No "التالي" pager exists in the Home frame section 2**, and **section 3's view-all button reads "اكتشف اكثر"** (transparent primary button + right arrow), not "اكتشف الكل". Follow Figma: no pager; the instructors section ends with a transparent "اكتشف اكثر" CTA.

4. **FAQ (section 5)** in Figma is a heading + a 2-column grid of **6** bordered accordion cards. The existing `FaqSection` renders a single `Accordion` (one column). Decision: compose `FaqSection` twice (two columns, 3 items each) inside the section wrapper's responsive grid — do not change `FaqSection`'s internals. On small screens it stacks to one column.

5. **i18n:** all new copy goes under a new `home.homePage` sub-namespace so the existing `home.heroTitle`/`heroSubtitle` (used by `generateMetadata`) and the old Landing keys stay intact. Add identical key trees to `messages/ar.json` and `messages/en.json`. Any strings added under `organisms` (new organisms' fallback labels) MUST be added to BOTH files or the `messages-parity` test (checks only the `organisms` subtree) fails.

6. **Shared card anatomy:** the Course Card and Instructor Card are the same vertical shape (cover image on top, bordered 1.5px `border-subtle`, radius 24 = `rounded-card-xl`, padding 16 = p-4, gap 24, `shadow-card`), a title (paragraph-lg semibold) + subtitle (paragraph-xsm), a row of 3 icon+text meta items separated by vertical dividers (`text-secondary`), an outlined full-width primary CTA, and an absolutely-positioned top-start rating Badge (primary filled, `RateIcon` + value). The Course Card adds a price row (error-light "خصم %45" Badge + strikethrough old price + current price). Build `MediaInfoCard` as one organism with an optional price row + optional rating badge so both sections reuse it. All spacing uses logical utilities (ps/pe/ms/me/start/end), never left/right.

7. **Colors/tokens:** use existing tokens only — `bg-primary`, `bg-secondary`, `bg-accent`, `bg-warning`, `text-secondary`, `border-subtle`/`border` , `shadow-card`, `rounded-card-xl`, `primary-light`, Badge/Button atoms. Gradients: navy card `from-primary to-[color:var(--surface-inverse)]`-style using existing primary/secondary + a dark stop; match Figma angle (~116deg for progress cards, ~250deg for offer cards). Do NOT touch tokens or the font.

## Assets (download first; never use temp figma URLs at runtime)

Download with `curl -L` into `public/home/` (recreate the folder). Map (temp URL → file). The three card covers and the two illustrations are the real runtime PNGs; the small glyphs are already covered by `@/components/icons` so they do NOT need downloading.

- `public/home/course-1.png` ← imgImage1 `https://www.figma.com/api/mcp/asset/ab68dc1c-47ee-4412-a6b3-b1be0b0544dc.png`
- `public/home/course-2.png` ← imgImage2 `https://www.figma.com/api/mcp/asset/96616cdc-0128-4c67-9cdd-eb5fbbca7696.png`
- `public/home/course-3.png` ← imgImage3 `https://www.figma.com/api/mcp/asset/aa199fbf-3955-4862-b204-17982a07a7ea.png`
  (The instructor cards reuse the same three covers — image1/2/3 — in the frame; reuse these files for instructors too, or download under instructor-*.png if distinct photos are wanted. They are identical nodes in Figma, so reuse.)
- `public/home/offer-instructor.png` ← imgImage5 `https://www.figma.com/api/mcp/asset/8431aef2-5592-4b7c-b2e7-f455c9ef3572.png` (teal offer card illustration)
- `public/home/offer-books.png` ← imgImage4 `https://www.figma.com/api/mcp/asset/aa073c42-7ab9-4a76-bdad-53d348660602.png` (navy/gold stacked-books illustration)

Icons to use from `@/components/icons`: `StopwatchIcon`, `BookOpenedIcon`, `BookClosedIcon`, `LayersIcon`, `PersonIcon`, `LibraryIcon`, `BagIcon`, `RateIcon`, `SparklesIcon`, `SigmaIcon`, `RightArrowIcon`.

---

# Steps

- [ ] 1. Download the 5 runtime images into `public/home/`.
      Run the five `curl -L "<temp-url>" -o public/home/<file>` commands (New-Item the folder first). Confirm the files are non-empty PNGs.
      Files: `public/home/course-1.png`, `course-2.png`, `course-3.png`, `offer-instructor.png`, `offer-books.png`
      Verify: `Get-ChildItem public/home` lists five PNGs each > 1KB.

- [ ] 2. Add the `home.homePage` i18n subtree (and any new `organisms.*` fallback keys) to `messages/en.json` and `messages/ar.json`, in sync.
      Add `home.homePage` with: `tracking` (heading, subheading, and a `cards` array/object of 3 items: badge, greeting "أهلًا بعودتك!", body, `timeLeft`, `lesson`, `grade`, cta "متابعة التعلّم"); `courses` (heading, subheading, 3 items: title, instructor, duration, grade, students, oldPrice, price, discount, cta "احجز الأن", ratings); `instructors` (heading, subheading, 3 items: name, role, courses "+12 دورة", experience "+7 سنوات خبرة", students "+50 طالب", cta "عرض الملف", ratings, viewAll "اكتشف اكثر"); `offers` (heading "تابع تقدّمك في رحلتك التعليمية", subheading, two cards: badge "مقترح لك", title, body, cta). If the new organisms (step 3) use i18n fallbacks, add those under `organisms.mediaInfoCard` / `organisms.progressTrackingCard` / `organisms.offerCard` in BOTH files.
      Files: `messages/en.json`, `messages/ar.json`
      Verify: `pnpm run test src/components/organisms/messages-parity.test.ts` passes (organisms subtree parity).

- [ ] 3. Create the `ProgressTrackingCard` organism (section 1 card).
      A client-safe presentational card: props `{ value:number; surface:"primary"|"secondary"; badgeLabel; greeting; body; meta: {timeLeft; lesson; grade}; ctaLabel; href? }`. Composes `ProgressRing` (pass `state="inverse"`, `value`), `Badge` (primary for navy / accent for teal, filled), the greeting (paragraph-lg, `text-primary-foreground`), body (paragraph-xsm inverse), a meta row of 3 icon+text groups (`StopwatchIcon`/`BookOpenedIcon`/`LayersIcon`, separated by `Ellipse`-style dots or `•`), and an inverse-filled `Button` ("متابعة التعلّم"). Gradient surface via inline style matching Figma (navy: primary→dark ~116deg; teal: secondary→dark). Logical padding (p-8 = 32), gap-6, `rounded-card-xl`, w-full. Export from the organisms barrel.
      Files: `src/components/organisms/progress-tracking-card.tsx`, `src/components/organisms/index.ts`
      Verify: `pnpm run typecheck` passes; `pnpm run test src/components/organisms/progress-tracking-card.test.tsx` (step 8) passes.

- [ ] 4. Create the `MediaInfoCard` organism (sections 2 + 3 card).
      Props: `{ imageSrc; imageAlt; title; subtitle; meta: {icon:ReactNode; label:ReactNode}[]; ctaLabel; href?; rating?:ReactNode; price?: {current:ReactNode; old?:ReactNode; discountLabel?:ReactNode} }`. Layout: bordered 1.5px `border` card, `rounded-card-xl`, `p-4`, `gap-6`, `shadow-card`, `bg-card`; `next/image` cover (aspect ~3/2) at top; title (paragraph-lg semibold `text-foreground`) + subtitle (paragraph-xsm `text-body`); a wrap row of meta items in `text-secondary` with vertical dividers between them; optional price row (`Badge variant="error" tone="light"` discount + strikethrough old price `text-disabled line-through` + current price paragraph-lg semibold); outlined full-width primary `Button` (CTA); when `rating` is set, an absolutely positioned top-start primary-filled `Badge` with `RateIcon` + value. All spacing logical (use `start-*`/`end-*`, `ps/pe`). Export from barrel. Grep call sites of the barrel to confirm no name clash (`MediaInfoCard` is new).
      Files: `src/components/organisms/media-info-card.tsx`, `src/components/organisms/index.ts`
      Verify: `pnpm run typecheck` passes; `pnpm run test src/components/organisms/media-info-card.test.tsx` (step 8) passes.

- [ ] 5. Create the `OfferCard` organism (section 4 cards).
      Props: `{ surface:"teal"|"gold"; illustrationSrc; illustrationAlt; badgeLabel; title; body; ctaLabel; href? }`. A wide 628px card: `overflow-clip`, `rounded-card-xl`, `p-8`, gradient surface (teal: secondary→dark ~250deg; gold: dark→amber ~250deg) via inline style with existing color vars; a `next/image` illustration bleeding off the start edge (absolutely positioned, `pointer-events-none`); a content column aligned to the end with a Badge (`accent` for teal / `warning` for gold, filled, `SparklesIcon`), title (paragraph-lg `text-primary-foreground`), body (paragraph-xsm inverse), and an inverse-filled `Button`. Logical positioning only. Export from barrel.
      Files: `src/components/organisms/offer-card.tsx`, `src/components/organisms/index.ts`
      Verify: `pnpm run typecheck` passes; `pnpm run test src/components/organisms/offer-card.test.tsx` (step 8) passes.

- [ ] 6. Create the five section wrapper server components under `_sections/`.
      Each is a thin server component that reads `useTranslations`/`getTranslations("home")`, builds a heading block (h2 `text-primary` h3-scale + subheading `text-secondary` paragraph-md, end-aligned), and arranges the organisms. Use a shared container (`mx-auto w-full max-w-[1280px]`, section gap 120px handled by the page). - `tracking-section.tsx`: heading + a responsive row of 3 `ProgressTrackingCard` (surfaces primary/secondary/primary) from `homePage.tracking`. - `courses-section.tsx`: heading + responsive 3-col grid of `MediaInfoCard` with price + rating from `homePage.courses`. - `instructors-section.tsx`: heading + responsive 3-col grid of `MediaInfoCard` (rating, no price) from `homePage.instructors`, then a centered transparent primary `Button` "اكتشف اكثر" + `RightArrowIcon`. - `offers-section.tsx`: heading + responsive 2-col row of `OfferCard` (teal instructor + gold books) from `homePage.offers`. - `faq-section-block.tsx`: heading + responsive 2-col grid, each column a `FaqSection title={null}` with 3 `FaqItem`s (6 total) from `homePage.faq`.
      Files: `src/app/[locale]/(public)/_sections/tracking-section.tsx`, `courses-section.tsx`, `instructors-section.tsx`, `offers-section.tsx`, `faq-section-block.tsx`
      Verify: `pnpm run typecheck` passes.

- [ ] 7. Replace `src/app/[locale]/(public)/page.tsx` body with the composed Home Page.
      Keep the existing imports + `generateMetadata` unchanged (still uses `home.heroTitle`/`heroSubtitle`). Replace the `HomePage` return with a top-level `<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[120px] px-5 py-16 lg:py-24">` (RTL-safe) rendering, top→bottom: `<TrackingSection/>`, `<CoursesSection/>`, `<InstructorsSection/>`, `<OffersSection/>`, `<FaqSectionBlock/>`. Keep `setRequestLocale(locale)`. Do NOT add a Hero and do NOT add Navbar/Footer.
      Files: `src/app/[locale]/(public)/page.tsx`
      Verify: `pnpm run typecheck`; `pnpm run lint` 0 errors; `pnpm run build` succeeds.

- [ ] 8. Add unit tests for the three new organisms (the non-trivial compositions).
      Follow the `progress-ring.test.tsx` pattern (render inside `NextIntlClientProvider` with `messages/en.json`). - `progress-tracking-card.test.tsx`: renders the greeting/body/cta text, the ProgressRing `progressbar` with `aria-valuenow`, and that `surface="secondary"` vs `"primary"` apply distinct classes/badge variants. - `media-info-card.test.tsx`: renders title/subtitle/cta, each meta label, the rating badge when `rating` is set, and the price row (discount + old + current) only when `price` is provided. - `offer-card.test.tsx`: renders badge/title/body/cta and the illustration `img` alt; `surface` toggles the badge variant.
      Files: `src/components/organisms/progress-tracking-card.test.tsx`, `media-info-card.test.tsx`, `offer-card.test.tsx`
      Verify: `pnpm run test` — all tests green (new + existing, incl. messages-parity).

- [ ] 9. Full verification + fidelity pass.
      Run the full gate, then compare the built `/` to Figma.
      Verify: `pnpm run typegen`; `pnpm run typecheck`; `pnpm run lint` (0 errors); `pnpm run test` (green); `pnpm run build` (succeeds). Then `get_screenshot` on `624:3480` and per-section child nodes (`624:3493`, `624:3501`, `656:6918`-area instructors, `679:7778`, `656:7326`) and compare layout/spacing/colors/typography to the running `/` page; iterate section wrappers/organism classes until there is no visible drift. Remove any temp files (keep the authored sections, organisms, tests, and downloaded `public/home/` images).

---

## Digest

Build: `pnpm run build`. Typecheck: `pnpm run typecheck` (`tsc --noEmit`). Typegen: `pnpm run typegen` (`next typegen`, needed for `PageProps`/`LayoutProps` globals). Lint: `pnpm run lint` (`eslint`). Tests: `pnpm run test` (`vitest run`, jsdom, setup `./vitest.setup.ts`, includes `src/**/*.{test,spec}.{ts,tsx}`). PowerShell: chain with `;`, use `pnpm` not `npm`. Verified today: existing tests pass is the assumed green base (not re-run here); `messages-parity.test.ts` checks only the `organisms` subtree key parity between en.json and ar.json.

### `src/app/[locale]/(public)/page.tsx` (MODIFY — step 7)

Current: `generateMetadata(...)` using `buildMetadata` + `t("heroTitle")`/`t("heroSubtitle")`, and `HomePage({params})` returning a centered hero `<section>` with two Buttons. Keep `generateMetadata` and the `setRequestLocale`/`getTranslations("home")` lines. Replace only the returned JSX with the 5 section components in a `max-w-[1280px]` column (gap 120px). Covered by: build + the organism/section render (no direct page test required). Imports to add: the five `_sections/*` components.

### `src/app/[locale]/(public)/layout.tsx` (READ-ONLY — do not edit)

Already renders `<Navbar/>`, `<main>`, `<Footer/>`. The page must not add these.

### `src/components/organisms/index.ts` (MODIFY — steps 3/4/5)

Barrel; add `export { ProgressTrackingCard } from "./progress-tracking-card";`, `export { MediaInfoCard } from "./media-info-card";`, `export { OfferCard } from "./offer-card";`. No existing export clashes (checked: current exports listed, none named these). Covered by: typecheck + the three new tests.

### `src/components/organisms/progress-tracking-card.tsx` (CREATE — step 3)

New organism. Composes `ProgressRing` (`@/components/molecules`, props `value`, `state="inverse"`), `Badge`, `Button` (`appearance="filled" variant="inverse"`), icons `StopwatchIcon`/`BookOpenedIcon`/`LayersIcon`. `cn` from `@/lib/utils/cn`. Gradient via inline `style`. Test: `progress-tracking-card.test.tsx`.

### `src/components/organisms/media-info-card.tsx` (CREATE — step 4)

New organism. `next/image` cover; `Badge` (rating primary-filled; discount error-light); `Button` (`appearance="outline" variant="primary"` full width); meta rows `text-secondary` with vertical dividers; optional price row. `RateIcon` for rating. Test: `media-info-card.test.tsx`.
ProgressRing API confirmed: `{ value:number; state?:"default"|"inverse" }`, is `"use client"`, `role="progressbar"`, i18n `molecules.progress`.
Button API confirmed: `variant: primary|secondary|destructive|inverse`, `appearance: filled|outline|ghost`, `size: sm|md|lg|icon`, `asChild`.
Badge API confirmed: `variant: primary|secondary|accent|warning|error|inverse`, `tone: default|light`, `asChild`.

### `src/components/organisms/offer-card.tsx` (CREATE — step 5)

New organism. `next/image` bleeding illustration (absolute, `pointer-events-none`); `Badge` (accent/warning filled + `SparklesIcon`); `Button` inverse-filled; gradient via inline `style`. Test: `offer-card.test.tsx`.

### `src/app/[locale]/(public)/_sections/*.tsx` (CREATE — step 6)

Five thin server components. Use `getTranslations("home")` (async server components, matching `page.tsx`/`courses/page.tsx` pattern). Arrange organisms only; no restyling of organism internals. `FaqSection` API confirmed: `{ title?; items: {value;question;answer}[]; type?; defaultValue? }`, `title={null}` hides the heading. Covered by: typecheck + build + screenshot fidelity.

### `messages/en.json` + `messages/ar.json` (MODIFY — step 2)

Add `home.homePage` subtree (NOT touching `home.heroTitle`/`home.heroSubtitle` used by `generateMetadata`, nor the pre-existing Landing keys). Add any new `organisms.*` fallback keys to BOTH files. Test: `src/components/organisms/messages-parity.test.ts` (organisms subtree parity). `home` subtree is NOT parity-checked, but the brief requires en/ar in sync — mirror keys manually.

### Tests (CREATE — step 8)

`src/components/organisms/{progress-tracking-card,media-info-card,offer-card}.test.tsx`, following `src/components/molecules/progress-ring.test.tsx` (render within `NextIntlClientProvider locale="en" messages={en}`). Run with `pnpm run test`.

### Figma reference (source of truth)

Frame `624:3480` (file `y0eOLyKLtTHnJYzOW046WR`). Section nodes: tracking `624:3493` (cards `696:8132`/`650:5511`/`629:3952`), courses `624:3501` (cards `624:3506/3507/3508`), instructors (cards `656:7092/7134/7049`, view-all `656:6930` "اكتشف اكثر"), offers `679:7778` (cards `679:7877` teal / `679:7648` gold), FAQ `656:7326` (6 accordion cards in a 2-col grid). Page container: 1280px wide, section gap 120px, heading→content gap 60px, heading→subheading gap 12px, card row gap 24px. Never paste raw Figma Tailwind — adapt to tokens/atoms.
