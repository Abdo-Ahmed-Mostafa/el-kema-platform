# Implementation Plan — Home page + Navbar fixes (El-Kema)

Source of truth: `.agents/design-system/figma-home-fixes.md` + `.agents/design-system/figma-tokens.md`. Figma file `y0eOLyKLtTHnJYzOW046WR`; Home frame `624:3480`, Navbar `451:1151`. Stack: Next.js 16.4.3, React 19, Tailwind v4, next-intl (ar default/RTL, en LTR), next-themes class dark. pnpm; PowerShell (`;` not `&&`). `cn` at `@/lib/utils/cn`. Logical properties ONLY (ps/pe/ms/me/start/end).

## Design decisions (grounded in the Figma screenshots + node 451:1151 context)

- **Tracking band card count = 2, not 3.** The Figma Home frame `624:3480` renders the first progress band as TWO equal-width cards (navy + teal) side by side, not three. Current code renders three (`lg:grid-cols-2 xl:grid-cols-3` over a 3-item array). Fix: two equal-width columns, two cards. (Spec FIX 1 explicitly says "verify against 624:3480 and match the count"; the frame shows 2.)
- **Navbar edges (RTL resolution).** The spec file FIX 6 is authoritative over the one-line brief. On screen (RTL): primary button on the LEFT, links centered, logo on the RIGHT. In logical terms that is: **Logo at inline-END, primary button at inline-START, links centered.** Confirmed by node `451:1151` design context (DOM order: button → labels → logo under `justify-between`, and the rendered screenshot). Height ≈ 92px, surface `#fafafa` (`bg-card`), x-padding 24 (`px-6`), bottom drop-shadow. No SearchBar, no visible locale/theme controls in the desktop row.
- **Spinner uses existing tooling.** `tw-animate-css` is imported in `globals.css`; Tailwind v4 ships `animate-spin`. Use `animate-spin motion-reduce:animate-none` on a decorative `aria-hidden` element — no new keyframes, no token changes.
- **CTA reuse.** Instructors section already has a `viewAll` ("اكتشف اكثر") CTA (ghost primary + `RightArrowIcon`). Courses section is the only one missing it; add the same pattern + a `viewAll` i18n key. Both CTAs route via `routes.courses` / `routes.teachers` using the i18n `Link`.
- **FAQ answer styling** lives in the Accordion molecule's content panel (`accordion.tsx`), which both FAQ columns compose. Adjust padding/typography there so the fix is reusable; `FaqSection` and `faq-section-block` stay as-is.

---

- [ ] 1. Animate the ProgressRing inner spinner (FIX 1b).
      Add a decorative `aria-hidden` spinning element inside `ProgressRing`: a small SVG circle/arc (or a positioned dot) that rotates continuously via `animate-spin motion-reduce:animate-none`. Keep the existing `role="progressbar"`, aria-valuenow/min/max, the static `{clamped}%` center label, and both `default`/`inverse` states. Color the spinner with `stroke-primary`/`stroke-primary-foreground` to match state. Reusable — the tracking card consumes it unchanged.
      Files: `src/components/molecules/progress-ring.tsx`
      Verify: `pnpm run test src/components/molecules/progress-ring.test.tsx` — existing progressbar/aria/clamp tests still pass; add one assertion that a `motion-reduce:animate-none` (or `animate-spin`) element exists and is `aria-hidden`.

- [ ] 2. Make the tracking band an equal-width 2-card row (FIX 1a).
      Change the `CARDS` array to 2 entries (navy `primary`, teal `secondary`) and the grid to equal-width two columns that stay inside the 1280 container with the Figma gap: `grid w-full gap-6 md:grid-cols-2` (drop `xl:grid-cols-3`). No overflow / no carousel bleed.
      Files: `src/app/[locale]/(public)/_sections/tracking-section.tsx`
      Verify: `pnpm run build` compiles; visually the band is two equal cards inside the container (confirm against Figma `624:3480`).

- [ ] 3. Add the missing courses "discover more" CTA (FIX 2).
      Add `"viewAll": "اكتشف اكثر"` to `home.homePage.courses` in `messages/ar.json` and `"viewAll": "Discover more"` in `messages/en.json` (keep the two files in sync). Render a CTA below the courses grid mirroring the instructors pattern: `<Button asChild appearance="ghost" variant="primary" size="lg">` wrapping the i18n `Link` to `routes.courses`, with `<RightArrowIcon aria-hidden />`. Place it per Figma (centered under the row) — set the section wrapper to center the CTA while keeping the heading `text-end` (follow the instructors-section structure: `items-center` section with an `items-end`/`text-end` heading block).
      Files: `src/app/[locale]/(public)/_sections/courses-section.tsx`, `messages/ar.json`, `messages/en.json`
      Verify: `pnpm run build`; `pnpm run test src/components/organisms/messages-parity.test.ts` stays green (note: parity test covers `organisms` only — manually confirm `home.homePage.courses.viewAll` exists in both files).

- [ ] 4. Confirm the instructors "discover more" CTA routes to /teachers (FIX 2).
      Instructors section already renders the `viewAll` CTA but as a plain `<Button type="button">` with no navigation. Wrap it with `asChild` + the i18n `Link` to `routes.teachers` so it actually routes, matching the courses CTA.
      Files: `src/app/[locale]/(public)/_sections/instructors-section.tsx`
      Verify: `pnpm run build`; the CTA is an anchor to `/teachers`.

- [ ] 5. Align the offers (second progress band) text to the start (FIX 3).
      The OfferCard content column already uses `items-end`/`text-end` (start in RTL = right). Verify against Figma that the heading/body/CTA sit at the start edge; the current center-looking result comes from the illustration overlap, not alignment. If any centered utility remains on the heading block or section, replace with `items-start`/`text-start` equivalents (logical only). No physical left/right.
      Files: `src/components/organisms/offer-card.tsx` (only if a non-start alignment is found), `src/app/[locale]/(public)/_sections/offers-section.tsx`
      Verify: `pnpm run build`; heading/body/CTA align to the inline-start in both RTL and LTR (confirm vs Figma offers band).

- [ ] 6. Fix the FAQ expanded-answer spacing + typography (FIX 4).
      In the AccordionItem content panel, add padding between the trigger and the answer and apply the Figma answer style: `paragraph-xsm` (14/20), body color via the existing `text-body` token, with top padding/separation from the question. Keep `role="region"`, `aria-labelledby`, `aria-controls`, `hidden` toggling intact. Change only the content `<div>` classes (e.g. `px-4 pb-4 pt-0` → `px-4 pb-5 pt-1 text-sm leading-5 text-body` plus a top separation) — do not touch the trigger's a11y wiring.
      Files: `src/components/molecules/accordion.tsx`
      Verify: `pnpm run test src/components/organisms/faq-section.test.tsx` — open/close + aria-expanded tests still pass; confirm open + closed states vs the Figma FAQ node.

- [ ] 7. RTL/LTR audit of the Home page + new organisms (FIX 5).
      Grep the Home sections and the three organisms for physical-direction classes (`left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`) and replace any with logical equivalents (`ps/pe/ms/me/start/end`, `text-start/text-end`). Known-good spots already use logical props (MediaInfoCard `start-[30px]`, OfferCard `end-[-40px]`); this step is a verification sweep + fix of any stragglers across `_sections/*` and `media-info-card.tsx` / `offer-card.tsx` / `progress-tracking-card.tsx`.
      Files: any under `src/app/[locale]/(public)/_sections/` and `src/components/organisms/{media-info-card,offer-card,progress-tracking-card}.tsx` that contain physical classes.
      Verify: `grep_search` for physical-direction classes in those paths returns none; `pnpm run build` compiles. Reason about LTR mirroring (logical props mirror automatically).

- [ ] 8. Rework the Navbar to match Figma `451:1151` (FIX 6).
      Rebuild the desktop row of `src/components/shared/navbar.tsx` with three zones under `justify-between`: Logo at the inline-END edge, `NavLinks` centered (absolutely centered or as the flexible middle zone), and a single primary navy icon Button at the inline-START edge wrapping the i18n `Link` to `routes.login` (or `routes.register`) with an icon (e.g. `GraduationIcon` / `PersonIcon`). REMOVE the `SearchBar` import + usage from the row. Remove `LocaleSwitcher`/`ThemeToggle` from the visible desktop row; move them into the mobile `Sheet` footer so the product keeps them. Surface `bg-card` (solid `#fafafa`), `~h-[92px]` (e.g. `min-h-[92px]`), `px-6`, bottom border + keep `shadow-card`, keep `sticky top-0 z-50`. Keep the `nav` i18n namespace, Logo, and the mobile Sheet with the links list.
      Files: `src/components/shared/navbar.tsx` (and `src/components/shared/nav-links.tsx` only if centering requires a prop)
      Verify: `pnpm run build`; `pnpm run test` stays green; confirm vs `get_screenshot(451:1151)` in RTL (logo right, links centered, navy icon button left), reason about LTR mirroring.

- [ ] 9. Full verification pass.
      Files: none (verification only).
      Verify (repo root, pnpm, all must pass): `pnpm run typegen`; `pnpm run typecheck`; `pnpm run lint` (0 errors); `pnpm run test`; `pnpm run build`. Remove any temp files under `.agents/tasks/home-navbar-fixes/_tmp`.

## Digest

Baseline verified: `pnpm run typecheck` exits 0 on main (green). Tooling: `tw-animate-css` imported in `globals.css`; `animate-spin` + `motion-reduce:` available. Build `pnpm run build`; tests `pnpm run test` (vitest).

- `src/components/molecules/progress-ring.tsx` — `function ProgressRing({ value, state, ... })`. Lines to change: SVG block (circles) + the `<span>{clamped}%</span>` center. Add a sibling decorative `aria-hidden` spinner (`animate-spin motion-reduce:animate-none`). Keep `role="progressbar"`, aria-valuenow/min/max, `t("progress", { value })`. Test: `progress-ring.test.tsx` (role/aria/clamp) — add a spinner-presence assertion.
- `src/app/[locale]/(public)/_sections/tracking-section.tsx` — `const CARDS = [...]` (reduce to 2: primary, secondary) and the grid `div` class `grid w-full gap-6 lg:grid-cols-2 xl:grid-cols-3` → `grid w-full gap-6 md:grid-cols-2`. No test file; covered by `build`.
- `src/app/[locale]/(public)/_sections/courses-section.tsx` — add a `<Button asChild appearance="ghost" variant="primary" size="lg">`+`RightArrowIcon` CTA after the grid; change section container to center the CTA (model on `instructors-section.tsx`). Imports: `Button`, `RightArrowIcon`, `routes`, i18n `Link`. Covered by `build`.
- `src/app/[locale]/(public)/_sections/instructors-section.tsx` — existing `viewAll` Button → `asChild` + `Link href={routes.teachers}`. Covered by `build`.
- `src/components/organisms/offer-card.tsx` / `offers-section.tsx` — verify start alignment; fix only if a centered/physical class is present. Test: `offer-card.test.tsx`.
- `src/components/molecules/accordion.tsx` — the content `<div role="region" ... className="text-body px-4 pb-4 text-sm">` → add vertical separation + `leading-5` (paragraph-xsm). Keep `role/aria-labelledby/aria-controls/hidden`. Tests: `accordion.test.tsx`, `faq-section.test.tsx`.
- `messages/ar.json` + `messages/en.json` — add `home.homePage.courses.viewAll` (`"اكتشف اكثر"` / `"Discover more"`), keep files in sync. Test: `messages-parity.test.ts` (organisms-only; verify home key manually).
- `src/components/shared/navbar.tsx` — `async function Navbar()`. Remove `SearchBar` (and its import), remove desktop `LocaleSwitcher`/`ThemeToggle` (move into Sheet). Three-zone `justify-between`: Logo inline-END, `NavLinks` centered, primary navy icon `Button`→`Link href={routes.login}` inline-START. Surface `bg-card`, `min-h-[92px]`, `px-6`, bottom border, `sticky top-0 z-50`, `shadow-card`. Call sites of `Navbar`: shared layout (site-wide) — signature unchanged. Covered by `test` + `build` + Figma screenshot.
- `src/components/shared/nav-links.tsx` — change only if centering needs a prop; `NavLinks({ links, className })` is the signature (className already supported, so likely no change).
