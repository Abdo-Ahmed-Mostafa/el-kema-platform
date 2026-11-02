# Public Home Page at "/" composed from design-system organisms

The change replaces the placeholder root page (`src/app/[locale]/(public)/page.tsx`) with the Figma "Home Page" frame (node 624:3480), built by composing the design system through five thin server-component section wrappers under `_sections/` plus three new reusable organisms (`ProgressTrackingCard`, `MediaInfoCard`, `OfferCard`). All copy is routed through the next-intl `home.homePage` namespace with full ar/en parity, images are served from `public/home/` via `next/image`, and the `(public)` layout keeps providing the single Navbar/Footer. The implementer documented in the plan that the brief's suggested organism mapping (OurWorkCard / InstructorHeroCard / Suggestion) does not match the richer Figma cards, and chose to build small new organisms instead — a deviation grounded in Figma-as-source-of-truth and permitted by the brief's own "build a new organism only if none matches" rule.

Watch for: the second progress band (section 4) is the correct frame content but reuses the section-1 heading "تابع تقدّمك في رحلتك التعليمية" verbatim (confirmed — matches Figma, which does the same, so not a defect); the progress CTA is capped at `max-w-[276px]` while Figma shows it spanning the content column (possible minor spacing drift); `home.homePage` i18n parity is enforced manually and NOT covered by the messages-parity test, which only guards the `organisms` subtree (likely — verified the test scope in the plan).

**Verdict**: APPROVED

## High-level view

The composition is genuinely atomic. The five section files are thin: each reads one `home.homePage.*` sub-namespace, builds an end-aligned heading block, and arranges organisms with no restyling of organism internals. The page container (`max-w-[1280px]`, `gap-[120px]`, logical `px-5`) and `generateMetadata` are preserved exactly as the brief required, and the `(public)` layout is untouched so there is no second Navbar/Footer.

The three new organisms carry the real styling and are prop-driven and presentational (no i18n lookups inside them, so the section wrappers own all copy). They use existing tokens and atoms (Badge, Button, ProgressRing, next/image), logical spacing only, and inline-`style` gradients built from existing CSS vars. No existing organism file was modified — the only edit to the shared barrel is three additive exports with no name clash. `FaqSection` is reused through its existing `title={null}` / `type="multiple"` API to build the 2-column, 6-item grid, so its internals are unchanged.

Visual fidelity against Figma is close. Screenshots of the full frame (624:3480), the teal tracking card (650:5511), and the course card (624:3506) confirm RTL direction (ring on the physical left via DOM order, rating badge pinned top-start = top-right, illustration bleeding off the logical `end` edge), the gradient treatments, the meta-row dot/divider patterns, the price row, and the outlined/ghost/inverse CTA variants all land as designed.

i18n parity is clean: the `home.homePage` subtree has 110 keys on each side with zero diff, English strings are real translations (not Arabic placeholders), and the Arabic view-all "اكتشف اكثر" and course CTA "احجز الأن" match the values the plan recorded from Figma (correcting the brief's "اكتشف الكل" / "التالي").

Separately, the working tree carries uncommitted auth changes (layout, forms, schemas, hooks) that are unrelated to this task and should not be folded into the home-page work.

<details>
<summary>Issues (4)</summary>

1. **Progress CTA width cap** — `ProgressTrackingCard` caps the CTA at `max-w-[276px]` while Figma shows it spanning the content column; verify against the frame and widen if it reads narrow. (possible)
2. **home namespace not parity-tested** — `home.homePage` ar/en parity is maintained by hand and not guarded by the messages-parity test (which only checks the `organisms` subtree); parity is currently exact (110/110) but future edits can silently drift. Consider extending the parity test to cover `home` or add a note. (likely)
3. **Course/instructor cover reuse** — courses and instructors reuse the same three cover PNGs (`course-1/2/3.png`); this matches Figma (identical nodes) and is intentional per the plan, but swap in distinct instructor photos if real content differs. (confirmed, informational)
4. **Unrelated auth changes in working tree** — the working tree has uncommitted auth edits unrelated to the home page; keep them out of the home-page commit and review them under their own task. (confirmed)

</details>

<details>
<summary>Details</summary>

### Atomic composition and the organism-mapping deviation

The brief named OurWorkCard, InstructorHeroCard, and WhyElqimah/Suggestion as the organisms to compose. The plan records that `get_design_context` on each Figma card showed those organisms lack the required API surface — OurWorkCard has no price/rating/meta-row, InstructorHeroCard is a horizontal portrait layout not the vertical image-on-top card, and Suggestion has no gradient/bleeding-illustration/badge. The implementer built `MediaInfoCard` (serving both the course and instructor cards via an optional price row + optional rating badge) and `OfferCard` instead. This is a documented, justified deviation: the brief says Figma is the source of truth and explicitly permits a new organism when none matches, provided it is reusable and the section wrappers stay thin. Both conditions hold — `MediaInfoCard` is reused across sections 2 and 3, and the wrappers only read translations and arrange props.

The section count also deviates from the brief in two places, both tracked to Figma: section 1 renders three progress cards (navy/teal/navy), not two, because the frame has three; and section 3 ends with a transparent "اكتشف اكثر" CTA rather than the brief's "اكتشف الكل", with no "التالي" pager on section 2 because the frame has none. These are fidelity corrections, not misses.

### Organism internals untouched; barrel additive

No existing organism source file changed (confirmed by name-only diff over `src/components/organisms` excluding the three new files and the barrel). The barrel diff is three additive export blocks for the new organisms and their prop types, with no collision against existing exports. `FaqSection` is composed twice through its public props (`title={null}`, `type="multiple"`, `items`) — the plan's intended 2-column/6-item grid — without editing the organism, so the backward-compatibility constraint is satisfied.

### RTL / logical-properties discipline

The added section and organism code contains no physical-direction utilities (the only "left" token in the diff is prose inside a doc comment). Direction is carried by DOM order under the RTL document: in `ProgressTrackingCard` the content column precedes the `ProgressRing`, so the ring renders on the physical left and content on the right — matching the teal-card screenshot. The `MediaInfoCard` rating badge uses `start-[30px] top-[30px]`, resolving to top-right in RTL, which matches the course-card screenshot. `OfferCard`'s illustration uses `end-[-40px]` to bleed off the logical end edge (left in RTL), matching the frame. All padding/margins use `ps/pe`/`gap` or symmetric utilities.

### i18n routing and parity

Every string in the five sections comes from `getTranslations("home.homePage.*")`; no literals are hardcoded in the JSX. `generateMetadata` still reads `home.heroTitle`/`home.heroSubtitle`, so the existing SEO path is intact and the new copy lives under a separate `homePage` sub-namespace that does not disturb the pre-existing `home` keys. A structural key comparison of `home.homePage` across both message files returns 110 keys each with an empty diff in both directions. English values are genuine translations ("Keep track of your learning journey", "Book now", "Discover more"), confirming the en file was not left as Arabic placeholders.

The one caveat worth flagging: the automated `messages-parity.test.ts` only asserts parity over the `organisms` subtree, so the `home` subtree's parity rests on manual discipline. It is correct right now; a follow-up edit that adds a key to only one file would pass CI. Extending the parity test to the `home` tree would close that gap.

### Visual fidelity (screenshots compared)

Full frame 624:3480, teal tracking card 650:5511, and course card 624:3506 were rendered and compared to the authored components. The tracking card matches on gradient, accent badge with the Σ glyph, greeting/body/meta-with-dots, ring size (~205px) and 25% value. The course card matches on the top-start rating badge, the three divider-separated meta items, and the price row (error-light discount badge + strikethrough old price + current price) with an outlined full-width CTA. One possible minor drift: the tracking CTA is capped at `max-w-[276px]` whereas Figma shows it filling the content column; worth a quick visual check but not blocking.

### Tests

Three organism tests were added following the `NextIntlClientProvider` + `messages/en.json` pattern. `media-info-card.test.tsx` asserts title/subtitle/meta/CTA, the rating badge only when `rating` is set, the price row only when `price` is provided, and the href→link path. Per the commit record the full suite is 164/164 green including messages-parity and the three new tests. Not tested: the five section wrappers have no direct render test (they are covered only by typecheck + build + screenshot fidelity), so a regression in a section's prop wiring or a missing `home.homePage` key would surface at build/runtime rather than in unit tests. Given the wrappers are thin and data-driven, this is a reasonable but noted gap.

### Verification record (not re-run)

The commit records typegen, typecheck (0 errors), lint (0 errors), test (164/164), and build (success). Per the task instruction the suites were not re-run; the diff, the i18n parity check, and the screenshot comparison were used to corroborate the recorded results.

</details>

<details>
<summary>File map</summary>

Home-page commit (d00dde8):

- `src/app/[locale]/(public)/page.tsx` — placeholder body replaced with the 5-section composition; `generateMetadata` kept.
- `src/app/[locale]/(public)/_sections/tracking-section.tsx` — section 1, three `ProgressTrackingCard`.
- `src/app/[locale]/(public)/_sections/courses-section.tsx` — section 2, three `MediaInfoCard` with price + rating.
- `src/app/[locale]/(public)/_sections/instructors-section.tsx` — section 3, three `MediaInfoCard` + ghost "اكتشف اكثر" CTA.
- `src/app/[locale]/(public)/_sections/offers-section.tsx` — section 4, teal + gold `OfferCard`.
- `src/app/[locale]/(public)/_sections/faq-section-block.tsx` — section 5, two `FaqSection` columns (6 items).
- `src/components/organisms/progress-tracking-card.tsx` (+ test) — new gradient tracking card wrapping `ProgressRing`.
- `src/components/organisms/media-info-card.tsx` (+ test) — new shared course/instructor card.
- `src/components/organisms/offer-card.tsx` (+ test) — new gradient offer card.
- `src/components/organisms/index.ts` — three additive exports.
- `messages/ar.json`, `messages/en.json` — `home.homePage` subtree added in sync (110 keys each).
- `public/home/{course-1,course-2,course-3,offer-instructor,offer-books}.png` — runtime images.
- `.agents/design-system/figma-home.md`, `.agents/tasks/home-page/plan.md` — spec + plan.

Out of scope (uncommitted working tree, unrelated auth task): `src/app/[locale]/(auth)/layout.tsx`, `src/features/auth/**`, `src/hooks/**`, `public/auth/signup.png`.

Full diff: `git -C d:\devs\El-Kema-platform diff HEAD~1 HEAD`
</details>
