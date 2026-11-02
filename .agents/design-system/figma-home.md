# Figma HOME PAGE — El-Kema integration spec (the "/" route)

IMPORTANT: The target is the Figma frame named **"Home Page"** node `624:3480` (page "UI", 1440×3846, RTL Arabic). This is NOT the "Landing Page" frame (445:3582) — do not build that one. Build the public home at the root route `/` by COMPOSING the existing design-system organisms (atomic approach).

Pull exact per-section layout via the figma power `get_design_context` on each node id, then ADAPT to tokens/atoms/organisms — never paste raw Figma Tailwind. Verify fidelity with `get_screenshot` per section and on the full frame 624:3480.

Target file: src/app/[locale]/(public)/page.tsx (the `/` route) — replace the current placeholder. It renders inside the (public) layout which already provides the sticky Navbar + Footer — do NOT add another navbar/footer. Keep the existing generateMetadata (home namespace) working. Content server-rendered; ALL copy via next-intl namespace `home`, Arabic + English IN SYNC (messages/ar.json + en.json); keep the messages-parity test green.

## Sections top→bottom (the Home Page, confirmed from the frame screenshot)

1. **تابع تقدّمك في رحلتك التعليمية** — section heading + subheading, then TWO large progress cards side by side: a teal/green one and a navy one, each with a circular 25% progress ring, title, meta rows, and a CTA. Compose the existing **Student Tracking Progress Card / Progress Ring** material: the molecule `ProgressRing` exists (src/components/molecules/progress-ring). If a dedicated tracking-progress organism exists use it; otherwise compose a small section using ProgressRing + Card atoms. Pull node detail from the Home frame subtree for exact layout/colors.

2. **اكتشف الدورات التي تناسبك** — heading + subheading + a row of 3 course cards (instructor photo, badge, title, rating + price, "اشترك"/enroll CTA) + a "التالي"/next pager. Compose the existing **OurWorkCard** organism (the course/work card).

3. **تعلّم على يد نخبة من المدرّسين** — heading + subheading + 3 instructor cards (photo, name, subject, CTA) + "اكتشف الكل"/view-all link. Compose **InstructorHeroCard** (or OurWorkCard if it matches the instructor-card visual better — verify via get_design_context).

4. **تابع تقدّمك في رحلتك التعليمية** (second band) — two wide cards: a teal card with an instructor photo + copy + CTA, and a navy/gold card with a stacked-books illustration + "عرض"/offer copy + CTA. Compose **WhyElqimah** and/or **Suggestion** — verify which matches; pull the illustration assets.

5. **كل ما تريد معرفته عن El-Qimah Learn** — FAQ section heading + an accordion list of questions. Compose the existing **FaqSection** organism (wraps the FAQ Accordion molecule).

(Footer comes from the public layout — do not add it. The navbar at the top is the public Navbar from the layout.)

## Requirements

- Atomic composition ONLY: build thin section wrappers that arrange EXISTING organisms. Put section components in src/app/[locale]/(public)/_sections/ (one server-component file per section) — page-specific compositions, not reusable organisms. Only build a NEW organism if a section genuinely has no matching organism AND is reusable; prefer composing existing ones. Do NOT duplicate organism styling or change organisms' internals (extend an organism API only if strictly needed and keep it backward-compatible; grep call sites).
- Prop-driven + next-intl `home` namespace for ALL copy, ar.json + en.json IN SYNC (messages-parity test stays green).
- TypeScript, cn, logical properties ONLY (ps/pe/ms/me/start/end — never left/right) for RTL+LTR, light + dark, shadow-card + existing tokens, Figma-accurate spacing/rhythm.
- Images/illustrations (instructor photos, book illustration, course covers): download from Figma via get_design_context asset URLs with `curl -L` into public/home/ and use next/image. NEVER use temp figma URLs at runtime. (public/home was cleaned; recreate it.)
- Do NOT touch design tokens or the font. Do NOT rebuild the Landing Page. Do NOT add a Hero organism (the Home Page has no marketing hero — it opens with the progress-tracking band).

## Verification (repo root, pnpm, all must pass)

`pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Use `get_screenshot` on node 624:3480 (and per-section child nodes) to compare the built `/` page to Figma; iterate until there is no visible drift in layout, spacing, colors, and typography. Commit to main. Clean up temp files (keep authored section components + downloaded home images).
