# Implementation Plan — Stage 4B-1 (Landing / Marketing Organisms)

Builds on committed stages 1 (tokens+font), 2A/2B (atoms), 3 (icons), 4A (molecules). Goal: add shared card tokens, swap the navbar raw shadow to the new token, and build 11 landing/marketing organisms under a new `src/components/organisms/` library with a barrel, prop-driven + next-intl copy, cva state variants, full a11y, RTL/LTR via logical properties, light+dark, and unit tests for the non-trivial ones. No app-page integration in this stage. Windows PowerShell — chain with `;`, not `&&`.

## Design decisions (grounded in codebase + Figma `get_design_context`)

- **Tokens are additive only.** The task names three new card-layer tokens; existing token values are never changed. The new tokens: `--shadow-card` (card drop shadow), `--radius-card-xl` (24px), `--text-body` (#52525a). All three are exposed through the existing `@theme inline` block so Tailwind generates `shadow-card`, `rounded-card-xl`, and `text-body` utilities.
- **Figma "Card Shadow" = `#1234581F` (navy @ ~12% alpha), offset (0,4px), blur 10px, spread 0** — confirmed verbatim in every organism's `get_design_context` metadata (Plans Card 803:4431, Levels 901:10148, Leaderboard 881:9322). Encode as literal rgba in `--shadow-card` (`0 4px 10px 0 rgba(18,52,88,0.12)`) because the shadow color is a fixed brand value, not a theme-reactive color; keep the same value in `.dark` (Figma shows no dark variant). This exact rgba is what the navbar must stop hardcoding.
- **Body text color `#52525a`** appears across organisms (Plans Card features/description, Leaderboard school). It is currently a raw hex literal in `accordion.tsx` (`text-[#52525a] dark:text-zinc-400`). Add `--text-body` so new organisms use `text-body`; set a dark value by lifting lightness in oklch (hue-neutral zinc, consistent with globals.css method) so `text-body` works in dark mode. Do NOT edit the existing accordion literal in this stage (out of scope; avoids churn on a committed molecule).
- **Typography scale is NOT tokenized** in this repo — stage 4A uses arbitrary utilities (`text-[20px] leading-8` for paragraph-lg; see `accordion.tsx`, `progress-ring.tsx`). Follow that precedent for organisms: H4 = `text-[28px] leading-10 font-bold`, paragraph-lg = `text-[20px] leading-8`, paragraph-sm = `text-base leading-6`, paragraph-xsm = `text-sm leading-5`, paragraph-xxsm = `text-xs leading-4`. Do not introduce typography tokens (keeps "do not alter core tokens" and matches existing style).
- **Card radii.** `--radius-xl` already exists (=20px) and `--radius-lg` (=16px). Figma card radii are small=12 (`rounded-md`), medium=16 (`rounded-lg`), large=20 (`rounded-xl`), xlarge=24. Only xlarge is missing → add `--radius-card-xl: 24px` exposed as `rounded-card-xl`. Reuse existing `rounded-md/lg/xl` for the others.
- **Card padding / gaps map cleanly to Tailwind defaults** (verified: 1 unit = 4px): padding large 24 = `p-6`, xlarge 32 = `p-8`; gaps sub-sm 12 = `gap-3`, sub-md 16 = `gap-4`, section-lg 24 = `gap-6`; icon-text gap 8 = `gap-2`. No tokens needed.
- **Compose atoms/molecules, never restyle.** Buttons → `Button` (`variant` primary/inverse, `appearance` filled/outline). Badges → `Badge` (`variant`/`tone`). Avatars → `Avatar`/`AvatarImage`/`AvatarFallback`. FAQ → the 4A `Accordion`/`AccordionItem`. Icons → `@/components/icons` (CheckmarkIcon, MedalIcon, RocketIcon, HandShakeIcon, etc. — all already re-exported). The Figma payloads render inline Button/Badge/Checkmark markup; the coder ADAPTS these to the existing components, never pastes the raw markup or asset URLs.
- **Images via `next/image` with a `src` prop.** `next.config.ts` has no `images.remotePatterns`, so organisms accept a caller-supplied `src` (local/placeholder) and render `next/image` with explicit width/height; do not embed Figma asset binaries. For decorative Figma vectors (Pro "star" bg, divider lines) use CSS/border instead of fetched SVGs where trivial.
- **Leaderboard is a profile score card, not a ranked list.** `get_design_context` on 881:9322 returns a single 318px card: avatar (150px) + name (paragraph-sm) + school (body) + a primary-surface row with two inverse-text score columns (subject degree / total) split by a vertical divider, plus an optional medal badge (`medalShow`). The organisms-doc "ranked list" summary is looser than the Figma truth — build the single card as `Leaderboard` and keep it prop-driven (rank/medal optional) so a consumer can stack several; do not invent list/pagination chrome the node does not show.
- **cva for state variants.** Organisms with Figma states (Plans Card Default/Pro, Our Work Default/Hover, Why To Start, Why Elqimah, Levels Default/Hover) get a `cva` variants object; hover states are driven by a `state`/variant prop (design "Hover" = the hover appearance), not only `:hover`, so the state is controllable and testable — matching how 4A molecules model states.
- **Client vs server components.** Organisms are presentational and prop-driven; default to plain (server-compatible) components. Only add `"use client"` where an organism needs interactivity/hooks (the FAQ wrapper composes the client `Accordion`; `useTranslations` for default copy is usable in both — mirror `search.tsx`/`progress-ring.tsx` which are client). Keep each organism a server component unless it needs client behavior.
- **next-intl default copy.** Add one `organisms.*` namespace to BOTH `messages/ar.json` and `messages/en.json`, kept key-for-key in sync. Copy is overridable by props; translations are the fallback. Arabic is default/RTL.

## Verification commands (from repo root, PowerShell)

`npm run typegen` ; then `npm run typecheck` ; `npm run lint` (zero errors) ; `npm run test` (65 existing stay green + new organism tests) ; `npm run build`. Baseline confirmed this session: **17 test files, 65 tests passing**.

---

# Implementation Plan

- [ ] 1. Add the three additive card tokens to `src/app/globals.css`.
      In `:root` add `--shadow-card: 0 4px 10px 0 rgba(18,52,88,0.12);`, `--radius-card-xl: 24px;`, and `--text-body: oklch(0.44 0.006 286);` (≈ #52525a). In `.dark` add a lifted `--text-body` (e.g. `oklch(0.72 0.006 286)`); keep `--shadow-card` and `--radius-card-xl` the same (brand-fixed). In the `@theme inline` block expose them: `--shadow-card: var(--shadow-card);` (→ `shadow-card`), `--radius-card-xl: var(--radius-card-xl);` (→ `rounded-card-xl`), `--color-text-body: var(--text-body);` (→ `text-body`/`bg-text-body`). Do NOT change any existing token value.
      Files: src/app/globals.css
      Verify: `npm run build` compiles CSS with no errors; `npm run lint` clean. (Utilities `shadow-card`, `rounded-card-xl`, `text-body` become available to later items.)

- [ ] 2. Swap the navbar raw rgba shadow for the token.
      In `src/components/shared/navbar.tsx` replace `shadow-[0_4px_4px_rgba(0,0,0,0.25)]` with `shadow-card` and update the adjacent NOTE comment (it currently says "no shadow token exists yet") to point at `--shadow-card`.
      Files: src/components/shared/navbar.tsx
      Verify: `npm run typecheck` ; `npm run build` — navbar renders; grep-free visual confirm that `shadow-[` no longer appears in navbar.tsx.

- [ ] 3. Create the organisms folder with an empty barrel and wire path alias usage.
      Create `src/components/organisms/index.ts` (barrel, initially empty — re-exports added as each organism lands). Confirm `@/components/organisms` resolves (tsconfig `@/*` already maps to `src/*`; no config change expected).
      Files: src/components/organisms/index.ts
      Verify: `npm run typecheck` passes with the (empty) barrel.

- [ ] 4. Add the `organisms` i18n namespace to both locale files, in sync.
      Add an `"organisms"` object to `messages/en.json` and `messages/ar.json` with the SAME keys in both. Keys (English / Arabic defaults): generic CTA `cta` ("Get started" / "ابدأ الآن"), `learnMore`, `choosePlan`, `features`, `price`, plus per-organism default labels used as fallbacks (e.g. `plans.popular`, `ourWork.readMore`, `levels.start`, `leaderboard.totalScore`, `leaderboard.subjectScore`, `faq.title`, `trust.title`, `whyElqimah.title`, `howToStart.step`). Keep ordering identical across files. These are fallbacks only; every visible string is also overridable via props.
      Files: messages/en.json, messages/ar.json
      Verify: `npm run build` (next-intl type/catalog check) ; `npm run typecheck`. A tiny parity test is added in item 13.

- [ ] 5. Build **Plans Card** (`plans-card.tsx`) — node 803:4431, states Default / Pro.
      cva `state: "default" | "pro"`. Shared shell: `rounded-card-xl` (24), `p-8`, `shadow-card`, `flex flex-col justify-between`, medium stroke 1.5 (`border-[1.5px]`). Default: `bg-card border-border`, outlined primary CTA. Pro: highlighted border (`border-primary-light-strong`) + subtle gradient surface + filled primary CTA + accent feature text. Compose: `Badge` (variant primary) for the tag, `Button` for CTA, `CheckmarkIcon` for each feature row. Title H4; price row in a subtle (`bg-muted`, Pro=primary/secondary-light gradient) `rounded-md` box; feature list = body text (`text-body`) rows with leading check icon. Props: `title`, `description`, `price`, `features: string[]`, `badgeLabel?`, `ctaLabel?`, `state`, `onCtaClick?`/`ctaHref?`, `className`. a11y: `<article>` or `role="group"` with `aria-labelledby` on the H4; CTA is a real `Button`. RTL via logical props only.
      Files: src/components/organisms/plans-card.tsx, src/components/organisms/index.ts (add export)
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 6. Build **Our Work Card** (`our-work-card.tsx`) — node 753:4774, states Default / Hover.
      cva `state: "default" | "hover"`. `next/image` at top (radius none top, card radius below via `overflow-hidden rounded-xl`), `Badge` (variant secondary), title paragraph-lg, body `text-body`, CTA `Button`. `shadow-card`; hover state adds medium stroke (`border-[1.5px] border-border`) — drive via `state` prop AND real `:hover`/`focus-within` so it works interactively. Props: `imageSrc`, `imageAlt`, `title`, `body`, `badgeLabel?`, `ctaLabel?`, `href?`, `state?`, `className`.
      Files: src/components/organisms/our-work-card.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 7. Build **Why To Start Card** (`why-to-start-card.tsx`, node 769:3074) and **Why Elqimah** (`why-elqimah.tsx`, node 739:2952).
      Two small, closely-related icon+text organisms (same pattern, batch them). Why To Start: vertical icon + heading + text (~194×206), cva `state` default/hover (hover lifts border/shadow). Why Elqimah: horizontal row icon + title + subtitle (~336×86). Both take an `icon?: React.ReactNode` (default from `@/components/icons`), `title`, `text`/`subtitle`, `className`. Icon sits in a rounded tile; use logical padding. a11y: heading element for the title; decorative icon `aria-hidden`.
      Files: src/components/organisms/why-to-start-card.tsx, src/components/organisms/why-elqimah.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 8. Build **Trust Section** (`trust-section.tsx`, node 843:5333) and **How To Start** (`how-to-start.tsx`, node 791:3459).
      Trust Section: a `<section>` landmark holding a row of trust items (logos/stats) — prop `items: { logo?: ReactNode; label: string; value?: string }[]`, optional `title`, renders a flex/grid row; images via `next/image`/slot. How To Start: a 258×68 step indicator — prop `steps: { label: string; icon?: ReactNode }[]` and `current?: number`, rendered as an ordered list (`<ol>`) with connectors drawn via borders (no fetched SVG lines); mark current/active state. a11y: Trust = `<section aria-labelledby>`; How To Start = `<ol>` with `aria-current="step"` on the active step.
      Files: src/components/organisms/trust-section.tsx, src/components/organisms/how-to-start.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 9. Build **Instructor Hero Card** (`instructor-hero-card.tsx`) — nodes 856:5879 + hero image 856:5883.
      ~470px-wide instructor profile hero: `next/image` hero (via `imageSrc` prop), name (H4/paragraph-lg), subtitle/role (body), optional badges and a CTA `Button`, `shadow-card`, `rounded-card-xl`. Compose `Badge`/`Button`; avatar via `Avatar` if a circular portrait is shown. Props: `imageSrc`, `imageAlt`, `name`, `role`, `bio?`, `badges?: string[]`, `ctaLabel?`, `href?`, `className`. a11y: `<article>` with `aria-labelledby` on the name heading.
      Files: src/components/organisms/instructor-hero-card.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 10. Build **Suggestion** (`suggestion.tsx`, node 685:8032, states First / Second) and **Levels** (`levels.tsx`, node 901:10148, states Default / Hover; + details 947:3942).
      Suggestion: 628×258 panel, cva `state: "first" | "second"` (two layout/emphasis variants); icon + heading + body + CTA; `shadow-card`. Levels: 281×240 card — icon circle (`rounded-full size-[60px]`) + level label (paragraph-lg) + CTA `Button`; cva `state: "default" | "hover"` where hover = `bg-primary` surface + inverse text + inverse button (confirmed from 901:10148 payload). Expose a `details?` slot/children for "The Levels Details" (947:3942). Props: Levels `{ level, icon?, ctaLabel?, href?, state?, details?, className }`. a11y: level label is a heading; icon `aria-hidden`; hover state controllable via prop.
      Files: src/components/organisms/suggestion.tsx, src/components/organisms/levels.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 11. Build **Leaderboard** (`leaderboard.tsx`) — node 881:9322 (profile score card).
      Single 318px profile card: `Avatar`+`AvatarImage`/`AvatarFallback` (150px), name (paragraph-sm medium), school (`text-body`), a `bg-primary rounded-lg` row with TWO inverse-text columns (`subjectScore`/`totalScore` label + value) split by a vertical divider (`border-s`/pseudo-divider, logical), and an optional medal (`MedalIcon`, `medal?: boolean`). Subtle gradient surface + `shadow-card` + `rounded-xl`. Props: `name`, `school`, `avatarSrc?`, `avatarFallback`, `subjectScore`, `totalScore`, `subjectScoreLabel?`, `totalScoreLabel?`, `rank?`, `medal?`, `className`. Default labels from `organisms.leaderboard.*`. a11y: `<article aria-labelledby>` on the name; divider decorative.
      Files: src/components/organisms/leaderboard.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 12. Build **FAQ Section** wrapper (`faq-section.tsx`) — context 656:7297.
      A `<section>` landmark wrapping the 4A `Accordion`/`AccordionItem` (import from `@/components/molecules`). Props: `title?`, `items: { value: string; question: ReactNode; answer: ReactNode }[]`, `type?: "single" | "multiple"`, `defaultValue?`, `className`. Render a heading (`aria-labelledby` ties section to it) then map items to `AccordionItem`. Do NOT restyle the accordion — compose it. Default `title` from `organisms.faq.title`. Because `Accordion` is a client component, add `"use client"` only if this wrapper needs client state; otherwise keep it a server component passing children (prefer server — the Accordion itself is the client boundary).
      Files: src/components/organisms/faq-section.tsx, src/components/organisms/index.ts
      Verify: `npm run typecheck` ; `npm run lint`.

- [ ] 13. Add unit tests for the non-trivial organisms.
      Non-trivial (state logic, composition, a11y wiring, i18n fallback) → test these: **Plans Card** (renders Default vs Pro — asserts CTA appearance/`data-state`, feature rows, labelled heading), **Our Work Card** (badge + image alt + state), **Levels** (default vs hover inverse styling via `data-state`, CTA present), **Leaderboard** (name/school/score labels, optional medal, avatar fallback), **FAQ Section** (renders N accordion items, heading labels the section, toggling an item via keyboard works through the composed Accordion), and a **messages parity** test asserting `organisms` keys match between `en.json` and `ar.json`. Trivial presentational ones (Why To Start, Why Elqimah, Trust, How To Start, Suggestion, Instructor Hero) may get a lighter smoke test (renders without crashing + exposes heading) but are not required. Follow the existing test patterns: `render`+`screen` from `@testing-library/react`, `userEvent` for keyboard, and wrap any `useTranslations` component in `NextIntlClientProvider` with `messages/en.json` (see `search.test.tsx`, `selectable-card.test.tsx`).
      Files: src/components/organisms/plans-card.test.tsx, our-work-card.test.tsx, levels.test.tsx, leaderboard.test.tsx, faq-section.test.tsx, and src/components/organisms/messages-parity.test.ts
      Verify: `npm run test` — all new tests pass AND the 65 existing stay green.

- [ ] 14. Full verification pass and cleanup.
      From repo root run, in order: `npm run typegen` ; `npm run typecheck` ; `npm run lint` ; `npm run test` ; `npm run build`. Fix every error/warning until all are zero. Remove any temp/scratch files. Do NOT adopt organisms into app pages. Then stage and commit to `main` (only after all five commands pass).
      Files: (none new — verification + commit)
      Verify: all five commands exit 0; `git status` clean after commit.

---

## Digest

Build/test commands (confirmed this session): `npm run typegen`, `npm run typecheck`, `npm run lint`, `npm run test` (vitest; **65 tests / 17 files green** today), `npm run build` (Next 16.4.3, Tailwind v4 CSS-first). PowerShell: chain with `;`.

### src/app/globals.css (MODIFY — additive)

- `:root` block (ends ~line 87): ADD `--shadow-card`, `--radius-card-xl`, `--text-body`. `.dark` block (ends ~line 170): ADD lifted `--text-body` (keep shadow/radius identical).
- `@theme inline` block (ends ~line 245, just before `--font-sans`): ADD `--shadow-card`, `--radius-card-xl`, `--color-text-body` mappings so Tailwind emits `shadow-card`, `rounded-card-xl`, `text-body`.
- Existing tokens (colors, `--radius`, `--radius-sm/md/lg/xl`) UNCHANGED.
- Verified: `--radius-xl` already = base+10px (20px); only 24px xlarge is missing. Covered by: build + lint.

### src/components/shared/navbar.tsx (MODIFY — line 43)

- `<header className="… shadow-[0_4px_4px_rgba(0,0,0,0.25)] …">` → `shadow-card`; update NOTE comment (lines 41–43). No other change; still a server component.
- Covered by: typecheck + build (no dedicated test exists for navbar today).

### src/components/organisms/index.ts (NEW — barrel)

- Re-exports every organism as it lands: `PlansCard`, `plansCardVariants`, `OurWorkCard`, `WhyToStartCard`, `WhyElqimah`, `TrustSection`, `InstructorHeroCard`, `Suggestion`, `HowToStart`, `Levels`, `Leaderboard`, `FaqSection` (names final). Import site: `@/components/organisms`.

### New organism files (NEW) — all under src/components/organisms/

- `plans-card.tsx` (cva `state` default/pro; composes `Button`, `Badge`, `CheckmarkIcon`) — test `plans-card.test.tsx`.
- `our-work-card.tsx` (cva `state` default/hover; `next/image`, `Badge`, `Button`) — test `our-work-card.test.tsx`.
- `why-to-start-card.tsx` (cva `state`; icon+heading+text) — light smoke test optional.
- `why-elqimah.tsx` (row icon+title+subtitle) — light smoke test optional.
- `trust-section.tsx` (`<section>`, items row, `next/image`) — light smoke test optional.
- `how-to-start.tsx` (`<ol>` step indicator, `aria-current`) — light smoke test optional.
- `instructor-hero-card.tsx` (`next/image` hero, `Badge`/`Button`/`Avatar`) — light smoke test optional.
- `suggestion.tsx` (cva `state` first/second) — light smoke test optional.
- `levels.tsx` (cva `state` default/hover → primary surface + inverse; `Button`; `details` slot) — test `levels.test.tsx`.
- `leaderboard.tsx` (profile score card; `Avatar`, `MedalIcon`, two inverse score columns) — test `leaderboard.test.tsx`.
- `faq-section.tsx` (`<section>` wrapping 4A `Accordion`/`AccordionItem`) — test `faq-section.test.tsx`.
- Shared conventions (all): `cn` from `@/lib/utils/cn`; `cva` for stateful ones; `forwardRef` where a DOM ref is idiomatic (cards/sections); logical props only (`ps/pe/ms/me/start/end/border-s`); `focus-visible:ring-ring/50 focus-visible:ring-[3px]` on interactive elements (match atoms); `shadow-card` + `rounded-card-xl` + `text-body` from item 1; next-intl `organisms.*` fallbacks overridable by props; light+dark via semantic tokens.

### messages/en.json & messages/ar.json (MODIFY)

- ADD one `"organisms"` namespace, identical key set in both, Arabic values localized. Covered by `messages-parity.test.ts` (asserts key-set equality) + next-intl build check.

### Tests (NEW) — src/components/organisms/*.test.tsx(.ts)

- `plans-card.test.tsx`, `our-work-card.test.tsx`, `levels.test.tsx`, `leaderboard.test.tsx`, `faq-section.test.tsx`, `messages-parity.test.ts`. Pattern: `@testing-library/react` `render`/`screen`, `@testing-library/user-event` for keyboard, `NextIntlClientProvider` + `messages/en.json` for any `useTranslations` child (mirrors `search.test.tsx`). Expected: new tests pass; existing 65 remain green (total rises accordingly).

### Figma grounding (per-node, fetch with `get_design_context`, fileKey `y0eOLyKLtTHnJYzOW046WR`)

Plans Card 803:4431, Our Work 753:4774, Why To Start 769:3074, Why Elqimah 739:2952, Trust 843:5333, Instructor Hero 856:5879 (+image 856:5883), Suggestion 685:8032, How To Start 791:3459, Levels 901:10148 (+details 947:3942), Leaderboard 881:9322, FAQ context 656:7297. All payloads confirm `Card Shadow` = `#1234581F` (0,4) blur 10 and card radius xlarge 24 / body color #52525a — the three tokens in item 1. ADAPT each payload to the existing atoms/molecules/tokens; never paste raw Figma markup or asset URLs.

### Assumptions / gaps noted

- Leaderboard node is a single profile score card (not a ranked-list widget); built prop-driven so consumers can stack entries. No list/pagination chrome added (not in the node).
- Typography & body-color: typography stays arbitrary-utility (repo precedent); only `--text-body` is tokenized. Existing accordion `#52525a` literal left untouched (out of scope).
- `next/image` uses caller `src` (local/placeholder); no `images.remotePatterns` added since no real remote host is in scope this stage.
