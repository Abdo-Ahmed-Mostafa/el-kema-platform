# Stage 2A form/action atoms wired to stage-1 tokens

This change implements the six Figma form/action atoms (Button, Input, TextArea, Checkbox, RadioGroup, Switch) on top of the stage-1 CSS-variable token layer, without touching tokens or the font. Button is reshaped into three orthogonal axes (`variant` color-type × `appearance` style × `size`) driven by `compoundVariants`; the three new interactive atoms wrap Radix primitives added as exact-pinned deps; Input gains size/error/icon-slot support and TextArea mirrors it for multiline. All atoms are exported from the UI barrel and the existing Button call sites were migrated to the new `appearance` prop. Every color is a token utility — no arbitrary hex literals leaked into components.

Watch for: Input never renders the Figma "Filled" state (bg `#5688b8` / `--input`, text `#fafafa`); the `--input` token is defined but unused by the component (confirmed). Everything else matches the token doc exactly.

**Verdict**: APPROVED

## High-level view

Button expresses the Figma 4×3×3 matrix through two orthogonal axes (`variant` color-type, `appearance` style) composed with `compoundVariants`, each pairing resolving to the per-type `-hover`/`-pressed`/`-light`/`-light-strong` tokens whose hex matches the doc. The rename dropped `outline`/`ghost` from `variant`, which forced the six call-site migrations and two added button tests. Checkbox, Radio, and Switch wrap three exact-pinned Radix deps and match the doc palette, radius, and states; the Switch thumb travel is RTL-aware.

Input and TextArea share the Default and Hover states and an `error` prop that flips to `aria-invalid` + destructive. The one spec gap is Input's "Filled" state: the doc lists Default/Hover/Filled with Filled being the `#5688b8` accent fill, but no code path produces it and the matching `--input` token is unused.

The coder's commit message records all four verification commands (typecheck, lint, test, build) run from repo root and passing at zero errors (lint has one pre-existing config warning, not an error); this satisfies the verification gate.

<details>
<summary>Issues (2)</summary>

1. **Input Filled state missing** (confirmed) — The Figma Input spec lists three states (Default/Hover/Filled); only Default and Hover are implemented. The Filled state (bg `#5688b8` → `--input`, text `#fafafa`) has no code path and the `--input` token is defined but unused. Non-blocking: add a filled variant/prop if the Filled visual is required, or confirm it's deferred.
2. **Inverse outline/ghost use an un-specified approximation** (confirmed) — Button inverse outline/ghost hover/active use `primary-foreground/10` and `/20`; the token doc defines no inverse outline/ghost light values, so this is a reasonable fill the plan acknowledged. Non-blocking: confirm against Figma if inverse outline/ghost are actually used.

</details>

<details>
<summary>Details</summary>

### Button matrix via orthogonal axes

The old flat `variant` enum (which carried `outline`/`ghost` as values) is split into `variant` (`primary`|`secondary`|`destructive`|`inverse`) and `appearance` (`filled`|`outline`|`ghost`), with `size` as `sm`|`md`|`lg`|`icon`. The 4×3 color×style combinations are composed through `compoundVariants`, so each pairing resolves to the correct token set:

```
filled    → bg-{type} border-{type}-hover hover:bg-{type}-hover hover:border-{type}-pressed active:bg-{type}-pressed
outline   → border-{type} text-{type} hover:bg-{type}-light active:bg-{type}-light-strong
ghost     → text-{type} hover:bg-{type}-light active:bg-{type}-light-strong
```

These resolve against the stage-1 variables whose hex values (checked in `globals.css`) match the token doc exactly: primary `#123458`/hover `#102f50`/pressed `#0d2947`/light `#eff5fa`/light-strong `#d9e6f2`, and the teal/red equivalents. The pressed _border_ shades the doc lists as unmapped (`#0a2139`/`#0c766a`/`#a52d2d`) are approximated with `{type}-pressed` as the plan stated — within tolerance and consistent with the no-token-change constraint. Inverse filled uses `bg-primary-foreground text-primary hover:bg-primary-light active:bg-primary-light-strong`, matching the doc's inverse `#fafafa`/text `#123458`/hover `#eff5fa`/pressed `#d9e6f2`.

Sizes map the Figma 8/12/16px padding to `px-2 py-2`/`px-3 py-3`/`px-4 py-4` with `rounded-sm`/`md`/`lg` and heights 34/46/58. Gap is `gap-2` (8px), disabled drives `muted`/`muted-foreground` fg+bg+border (text `#a1a1aa`, bg `#f4f4f5`, border `#a1a1aa`), replacing the old `opacity-50`. `asChild`/`Slot` and icon support are preserved.

### Public-API rename propagated to call sites

Because `variant="outline"`/`"ghost"` is no longer valid, six call sites were migrated to `appearance="outline"`/`"ghost"` (navbar, user-menu, theme-toggle, locale-switcher, error-state, public landing page) — in-scope churn driven by the API change, not unrelated edits. `button.test.tsx` keeps its three original tests and adds two presence-only renders, asserting role presence rather than class strings.

### Radix deps pinned exact and resolved

`package.json` records the three new deps with no caret (`1.3.3`, `1.3.8`, `1.2.6`), and the committed `package-lock.json` resolves each `node_modules/@radix-ui/react-*` entry to exactly those versions. Pre-existing `@radix-ui/react-slot` (`^1.5.0`) and `lucide-react` (`^0.562.0`, provides `Check`) are unchanged, so the generation stays consistent as the plan intended.

### Checkbox / Radio / Switch palette and states

Checkbox: `rounded-[4px]` (radius 4), `border-border` default, `hover:border-primary hover:bg-primary-light`, `data-[state=checked]:bg-primary data-[state=checked]:border-primary`, and a lucide `Check` at `text-primary-foreground` — matching active bg/border `#123458`, checkmark `#fafafa`, hover `#eff5fa`+`#123458` border. Disabled maps to `muted`/`muted-foreground`. The label gap-8 / `text-xsm` requirement is delegated to the consumer via `Label`, documented in a JSDoc example — acceptable since the atom itself has no label.

Radio reuses the same palette with a `size-2 rounded-full bg-primary` filled indicator and the same hover/checked/disabled token classes. Switch: on-state `data-[state=checked]:bg-primary data-[state=checked]:border-primary-hover` (surface `#123458`, border `#102f50`), off/disabled `bg-muted border-muted-foreground` (surface `#f4f4f5`, border `#a1a1aa`), `rounded-full`, thumb `bg-primary-foreground`. Thumb travel is RTL-aware (`rtl:data-[state=checked]:-translate-x-[22px]`), which satisfies the RTL+LTR requirement for a directional control.

### Input / TextArea states and RTL icon slots

Both share Default (bg `muted` `#f4f4f5`, border `border` `#e4e4e7`, placeholder `muted-foreground` `#a1a1aa`) and Hover (border `primary`, bg `primary-light`) and a focus-visible `ring` ring. The `error` prop sets `aria-invalid` and flips border/text to `destructive`, matching the error-state requirement. Input sizes map SM (`h-[34px] rounded-sm px-2 py-2`) and MD (`h-[46px] rounded-md px-3 py-3`) to the Figma 8/12 padding. Icon slots render in a `relative` wrapper with absolutely-positioned spans on logical `start`/`end` insets and add `ps-9`/`pe-9` to the input, so leading/trailing icons sit correctly in both directions.

The gap: the Figma Input spec enumerates Default/Hover/**Filled**, where Filled is the `#5688b8` accent fill with `#fafafa` text. No variant, prop, or state in the component produces that fill, and the `--input` token (defined as `#5688b8` in both `:root` and `.dark`) is not referenced anywhere in the component. If the Filled visual is in scope it needs a code path; if it was intentionally deferred it should be recorded. Flagged as non-blocking because the two interactive states are present and the fill is a static visual that the task didn't tie to a specific trigger.

### Verification record

The commit message states, from repo root: `npm run typecheck PASS; npm run lint PASS (0 errors, 1 pre-existing config warning); npm run test PASS (6 files, 27 tests, incl. 5 button tests); npm run build PASS`. All four required commands are recorded at zero errors, so the verification gate is satisfied.

</details>

<details>
<summary>Files changed</summary>

- `src/components/ui/button.tsx` — rewritten to `variant`×`appearance`×`size` axes with `compoundVariants`; disabled via muted tokens.
- `src/components/ui/button.test.tsx` — two presence-only tests added for new axes; three originals kept.
- `src/components/ui/input.tsx` — `forwardRef` + `inputVariants` (sm/md), `error` prop, RTL-aware start/end icon slots.
- `src/components/ui/textarea.tsx` — new multiline atom mirroring Input styling + `error`.
- `src/components/ui/checkbox.tsx` — new, wraps `@radix-ui/react-checkbox` with Check indicator.
- `src/components/ui/radio-group.tsx` — new, `RadioGroup` + `RadioGroupItem` wrapping `@radix-ui/react-radio-group`.
- `src/components/ui/switch.tsx` — new, wraps `@radix-ui/react-switch` with RTL-aware thumb travel.
- `src/components/ui/index.ts` — barrel exports for `TextArea`, `Checkbox`, `RadioGroup`, `RadioGroupItem`, `Switch`, `inputVariants`.
- `package.json` / `package-lock.json` — three exact-pinned Radix deps.
- `src/components/{shared,layouts}/*`, `src/app/[locale]/(public)/page.tsx` — Button call sites migrated `variant`→`appearance`.

Full diff: `git -C d:\devs\El-Kema-platform show eb66719`

</details>
