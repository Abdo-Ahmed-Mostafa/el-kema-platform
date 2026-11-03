# Figma-accurate card + FAQ hover states on the Home page

Two hover treatments land in exactly the two target files: the course/instructor card (`MediaInfoCard`) promotes its outlined CTA to filled navy and lifts on hover, and the FAQ accordion (`AccordionItem`) gains a solid-navy hover row plus a Figma-accurate open/answer state. The change is split across two commits — an initial implementation (`eb351b7`) and a fix (`c0b4c6e`) that resolved an earlier review round by correcting the open-trigger treatment and the card's no-op shadow lift. Scope is surgical: 2 files, +18/-9, no token/font/API edits, logical properties only. Verified against live Figma nodes 656:7298 (Hover) and 656:7304 (Answer) via `get_screenshot` + `get_variable_defs`, and the Course Card component (624:3506/3507) — the implementation matches all three.

Watch for: the spec prose and the Figma source disagree on the FAQ open-trigger (spec said "navy with inverse text"; Figma node 656:7304 shows a light trigger with navy text and a navy chevron badge). The implementation correctly follows Figma, not the prose — confirmed by screenshot (confirmed).

**Verdict**: APPROVED

## High-level view

The card hover uses Tailwind `group`/`group-hover:` so hovering anywhere on the card drives both the elevation (border-primary + `shadow-xl`) and the CTA promotion from outlined to filled navy. The CTA carries both `hover:` and `group-hover:` overrides; the direct `hover:` set matters because the outline Button variant ships its own `hover:bg-primary-light`, and tailwind-merge (via `cn`) keeps the later `hover:bg-primary` so the filled-navy promotion actually wins. Surface is left untinted, which matches Figma (the hover variant relies on shadow + border, not a fill).

The FAQ trigger turns solid navy with inverse text on hover (656:7298) and, when open, becomes a light row with navy text (656:7304). The chevron now lives in a circular badge that inverts independently: light badge / navy chevron on hover, navy badge / inverse chevron when open — both confirmed against the Figma screenshots. The answer panel is a bordered card (`bg-muted` #f4f4f5, `border-primary-hover` #102f50, body text, padding 24 via `p-6`), and the item wrapper border emphasizes primary when open.

The a11y contract is untouched: the trigger is still a native `<button aria-expanded aria-controls>`, the panel is still a labelled `role="region"`, and the chevron rotation rides `data-[state=open]`. The existing accordion tests assert on roles, aria state, and text visibility only, so wrapping the chevron in an aria-hidden span doesn't disturb them.

The coder's recorded verification (commit `c0b4c6e`) reports typegen, typecheck, lint (0 errors), test (173/173, 42 files), and build all passing under pnpm at repo root.

<details>
<summary>Issues (2)</summary>

1. **Spec-vs-Figma contradiction on open-trigger** — The source-of-truth spec prose describes the FAQ open trigger as "navy with inverse text," but Figma node 656:7304 shows a light trigger with navy text. The code follows Figma (correct); the spec prose should be corrected to avoid future confusion. No code change needed.
2. **Trigger padding not bumped to Figma's 24** — Figma's FAQ trigger uses padding 24 (`Cards Tokens/Padding Large`); the trigger keeps the pre-existing `px-4 py-4` (16). This is pre-existing resting styling outside the hover spec's scope (the spec only calls out padding 24 for the answer panel, which is implemented), so it's informational, not blocking.

</details>

<details>
<summary>Details</summary>

### CTA promotion wins over the Button outline variant

The CTA is a `<Button appearance="outline" variant="primary">`, whose compound variant contributes `hover:bg-primary-light active:bg-primary-light-strong`. The card adds `hover:border-primary-hover hover:bg-primary hover:text-primary-foreground group-hover:...` on the same element. Because `Button` runs `cn(buttonVariants({ ..., className }))` and tailwind-merge keeps the last of two conflicting `hover:bg-*` utilities, the card's `hover:bg-primary` overrides the variant's `hover:bg-primary-light`. This was the specific defect the fix commit addressed — without the direct `hover:` set, pointer-on-button would have shown the light tint instead of filled navy. The `group-hover:` set covers the "pointer anywhere else on the card" case, where there's no variant conflict. Both sets are needed; neither is redundant.

```
card hover ─┬─> border-primary + shadow-xl   (lift)
            └─> group-hover: CTA → filled navy
button hover ──> hover: CTA → filled navy  (beats variant's bg-primary-light)
```

### shadow-xl vs the resting shadow-card no-op

The resting card already carries `shadow-card`. The first commit's `hover:shadow-card` would have been a visual no-op (same shadow resting and hovered). The fix switched the hover to `shadow-xl`, a distinct larger elevation, so the lift is actually perceptible. `transition-[color,border-color,box-shadow]` scopes the transition to the properties that change rather than `transition-all`.

### FAQ open-trigger: Figma overrides the spec prose

Node 656:7304 (`get_variable_defs`) returns both `Surface-Color/Primary/Default #123458` and `Surface-Color/Subtle #f4f4f5`, plus `Text-Color/Primary #123458` and `Icon-Color/Inverse #fafafa` — ambiguous on its own. The screenshot resolves it: the open trigger row is a light surface with navy text, and the chevron sits in a navy circular badge with a white chevron. The answer panel below is a light card with a primary border. The implementation matches: open trigger is `data-[state=open]:text-primary` (navy text on the unchanged light surface), the badge is `data-[state=open]:bg-primary data-[state=open]:text-primary-foreground` (navy circle, inverse chevron), and the panel is `border-t border-primary-hover bg-muted p-6`. The spec prose ("navy with inverse text while expanded") is wrong for the trigger; following the live node was the right call (confirmed).

### FAQ hover row + badge inversion

Node 656:7298 confirms the hover row is solid navy (`Surface-Color/Primary/Default #123458`) with inverse text (`#fafafa`), and the chevron badge is a light circle (`Surface-Color/Default #fafafa`) with a navy chevron (`Icon-Color/Primary #123458`). The implementation's `hover:bg-primary hover:text-primary-foreground` on the trigger and `group-hover/trigger:bg-primary-foreground group-hover/trigger:text-primary` on the badge reproduce this exactly. The named group `group/trigger` is used so the badge reacts to the trigger hover specifically, not the outer accordion item.

### A11y and tests preserved

The trigger remains a native button with `aria-expanded`/`aria-controls`; the panel remains `role="region"` with `aria-labelledby`; the chevron rotation stays on `data-[state=open]:rotate-180`. The chevron is now nested inside an `aria-hidden` span, which carries its own `data-state` for the badge styling. The existing tests assert only on roles, aria-expanded transitions, aria-labelledby wiring, and text visibility — none of which depend on the chevron's DOM nesting, so they stay green without edits. Public exports (`Accordion`, `AccordionItem`) and their prop types are unchanged.

### Logical properties and theming

No physical left/right utilities were introduced (`rounded-lg` is symmetric). All new color utilities resolve through semantic tokens (`primary`, `primary-foreground`, `primary-hover`, `muted`, `body`) that already theme in dark mode via `globals.css`, so light and dark are both covered without extra work. `#102f50` (`Border-Color/Primary` in the node defs) maps to the existing `--primary-hover` token, so `border-primary-hover` is the correct existing-token choice rather than a new token.

### Not tested

No new test was added for the hover/open visual states. The existing suite covers the a11y and toggle behavior (unchanged by this diff), but the hover-driven CTA promotion and the open/hover color classes are CSS-only and not asserted. That's acceptable for a styling change — these are presentational classes verified visually against Figma — but worth noting that a regression in the class strings wouldn't be caught by tests.

</details>

<details>
<summary>File map</summary>

- `src/components/organisms/media-info-card.tsx` — card gains `group`, `cursor-pointer`, `hover:border-primary hover:shadow-xl`, scoped transition; CTA (both link and button branches) gains `hover:`/`group-hover:` filled-navy promotion.
- `src/components/molecules/accordion.tsx` — item wrapper emphasizes `border-primary-hover` when open; trigger gets `group/trigger` + navy hover + navy-text open state; chevron wrapped in an inverting circular badge span; answer panel becomes a bordered `bg-muted` card with padding 24.

Full diff: `git -C d:\devs\El-Kema-platform diff aa57779 HEAD`

</details>
