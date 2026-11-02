# Review — Stage 4B-1 (Landing / Marketing Organisms)

Verdict: **APPROVED**

## Scope reviewed

Uncommitted working-tree changes: `messages/ar.json`, `messages/en.json`, `src/app/globals.css`, `src/components/shared/navbar.tsx` (tracked), plus the new untracked `src/components/organisms/` library (11 organisms, barrel, 6 tests). Reviewed against the verbatim task and `plan.md`.

## Verification evidence

No recorded verification notes existed in the task folder (only `plan.md`), so the required pass could not be read. A full spot-check was justified and run from the repo root:

- `npm run typegen` → types generated ✓
- `npm run typecheck` → clean (no diagnostics) ✓
- `npm run lint` → 0 errors (1 pre-existing warning in `lint-staged.config.mjs`, unrelated to this change) ✓
- `npm run test` → **23 files / 79 tests passing** (baseline 65 stay green + 14 new organism/parity tests) ✓
- `npm run build` → "Compiled successfully", full route tree prerendered ✓

## Requirement checks

- **Tokens additive only.** `globals.css` adds `--shadow-card` (`0 4px 10px 0 rgba(18,52,88,0.12)`), `--radius-card-xl: 24px`, `--text-body` (light + lifted dark), exposed via `@theme inline` as `shadow-card` / `rounded-card-xl` / `text-body`. No existing token value changed. Palette/font untouched.
- **Navbar.** Raw `shadow-[0_4px_4px_rgba(0,0,0,0.25)]` replaced with `shadow-card`; NOTE comment updated. No raw rgba shadow remains in navbar.
- **11 organisms present** under `src/components/organisms/` with a barrel at `@/components/organisms`: PlansCard, OurWorkCard, WhyToStartCard, WhyElqimah, TrustSection, InstructorHeroCard, Suggestion, HowToStart, Levels, Leaderboard, FaqSection. All barrel-exported.
- **Composition, not restyling.** Verified against the real atom/molecule APIs: `Button` (`variant` primary/inverse, `appearance` filled/outline/ghost, `asChild`, `size`), `Badge` (`variant`/`tone`), `Avatar`/`AvatarImage`/`AvatarFallback`, `Accordion`/`AccordionItem` (`type`, `defaultValue`, `value`, `title`), icons `CheckmarkIcon`/`MedalIcon` from `@/components/icons`. Every prop/variant used exists.
- **State variants via cva** on PlansCard (default/pro), OurWorkCard (default/hover), WhyToStartCard, Suggestion (first/second), Levels (default/hover). Hover states are prop-controllable (`data-state`) and also react to real `:hover`/`focus-within`.
- **a11y.** Cards are `<article aria-labelledby>`; sections are `<section aria-labelledby>`; HowToStart is an `<ol>` with `aria-current="step"`; decorative icons/dividers `aria-hidden`; CTAs are real `Button`s; focus-visible ring inherited from atoms. FAQ keyboard toggle covered by test.
- **RTL/LTR logical properties only.** `ps/pe/start/end/ms/me/border-s` used; no `left/right` found in the organisms.
- **i18n.** `organisms.*` namespace added to both locales; `messages-parity.test.ts` asserts key-set equality (passes). All copy prop-overridable with i18n fallback.
- **next/image** used in OurWorkCard and InstructorHeroCard with caller `src` + explicit sizing; no embedded Figma binaries.
- **TS + forwardRef + cn** throughout; `forwardRef` on cards/sections as idiomatic.
- **Tests** for the non-trivial organisms (plans-card, our-work-card, levels, leaderboard, faq-section) + parity — all present and passing.
- **No app-page adoption.** No `@/components/organisms` import exists under `src/app/**`.
- **No new dependencies.** `package.json` / `package-lock.json` unmodified.

## Findings

None. No reachable correctness, security, or data blockers identified; all required verification passes.
