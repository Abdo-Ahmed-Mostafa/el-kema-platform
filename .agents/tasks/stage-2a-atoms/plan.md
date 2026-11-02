# Implementation Plan — Stage 2A: Form/Action Atoms

Convert the El-Kema Figma atoms into code, building on the stage-1 tokens already live in `src/app/globals.css`. Do NOT change tokens or the font. All colors must reference existing CSS-variable-backed Tailwind utilities (`bg-primary`, `bg-primary-hover`, `bg-primary-pressed`, `bg-primary-light`, `bg-primary-light-strong`, `bg-secondary*`, `bg-destructive*`, `border-border`, `bg-muted`, `text-muted-foreground`, `ring-ring`, `text-primary-foreground`, etc.). Mirror existing conventions: `cva` + `VariantProps`, `cn` from `@/lib/utils/cn`, `React.ComponentProps<...>`, `data-slot` attributes, `asChild`/`Slot` where present, shadcn new-york style, `"use client"` on any component using Radix or hooks.

## Design decisions (made here, grounded in the codebase)

- **No new design tokens.** Every Figma hex in the token doc already maps to a stage-1 CSS variable (verified in `globals.css`). Example mappings the implementer must use: navy `#123458` → `primary`; `#102f50` → `primary-hover`; `#0d2947` → `primary-pressed`; `#eff5fa` → `primary-light`; `#d9e6f2` → `primary-light-strong`; teal `#14b8a6` → `secondary` (+ `-hover`/`-pressed`/`-light`/`-light-strong`); red `#ef4444` → `destructive` (+ variants); `#f4f4f5` → `muted`; `#a1a1aa` → `muted-foreground`; `#e4e4e7` → `border`; `#fafafa` → `*-foreground`; `#18181b` → `foreground`; filled-input `#5688b8` → `input`. No arbitrary hex literals in components — use the tokens. The one unmapped border shade in the doc (button pressed borders `#0a2139`/`#0c766a`/`#a52d2d`, switch-on border `#102f50` as a border) is approximated with the nearest existing token (`border-primary-pressed`, etc.); this keeps the "no token changes" constraint and is visually within tolerance. Rationale: the task forbids editing tokens, so components consume the established palette.
- **Button** keeps the existing `Button` function-component + `buttonVariants` cva shape and the `asChild`/`Slot` pattern. The current `variant`/`size` names are replaced to express the Figma matrix as two orthogonal axes — `variant` (color type: `primary` | `secondary` | `destructive` | `inverse`) and a new `appearance` axis (`filled` | `outline` | `ghost`) — plus Figma sizes `sm` | `md` | `lg`. `defaultVariants` = `{ variant: "primary", appearance: "filled", size: "md" }`. Rationale: Figma defines style (filled/outlined/transparent) independently of type (primary/secondary/error/inverse); a single flat `variant` enum would need 4×3=12 entries and lose the orthogonality. `button.test.tsx` only exercises default render, `disabled`, and `asChild` — none reference `variant`/`size` strings — so the public-API change does not break it (confirmed by reading the test). Disabled styling is driven by the native `:disabled` + `disabled:` utilities (text `muted-foreground`, bg `muted`, border `muted-foreground`), replacing the old `disabled:opacity-50`.
- **Input / TextArea** are plain styled primitives (no Radix input primitive exists or is needed). Add a `size` cva (`sm`/`md`) and an `error` prop (sets `aria-invalid` + destructive border/text). Icon slots are handled by a small wrapper pattern: `Input` accepts optional `startIcon`/`endIcon` `React.ReactNode`; when either is set it renders a relative wrapper with absolutely-positioned icons using logical insets (`start-*`/`end-*`) so it works in RTL and LTR, and adds padding on the correct logical side. TextArea mirrors Input styling minus the single-line height/icons.
- **Checkbox / Radio / Switch** use Radix primitives (consistent with every other interactive atom in `src/components/ui`, which all wrap Radix). These three Radix packages are NOT yet installed (confirmed against `package.json`: only avatar, dialog, dropdown-menu, label, select, separator, slot, tabs, tooltip are present). The installed Radix generation uses `@radix-ui/react-primitive@2.2.0` and `@radix-ui/react-slot@1.5.0` (confirmed in `package-lock.json`), which are React-19-compatible. Add exact-pinned, same-generation versions and let npm dedupe shared subpackages. Fallback (see item 6 note) if a version fails to resolve.

## Dependencies to add (exact pins, React 19 / Radix 2.2.0 generation)

Run from repo root with `npm install --save-exact <pkg>@<version>` so `package.json` records an exact version and the lockfile stays consistent:

- `@radix-ui/react-checkbox@1.3.3`
- `@radix-ui/react-radio-group@1.3.8`
- `@radix-ui/react-switch@1.2.6`

After install, run `npm ls @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch` and confirm each resolves and that `@radix-ui/react-primitive`/`@radix-ui/react-slot` are still deduped to a single version. If any of these exact versions fail to resolve against the installed stack, fall back to the latest `1.x`/`2.x` that npm reports compatible, pin THAT exact version, and record it in the Digest.

---

- [ ] 1. Add the three Radix dependencies (exact pins) and verify the lockfile.
      Install `@radix-ui/react-checkbox@1.3.3`, `@radix-ui/react-radio-group@1.3.8`, `@radix-ui/react-switch@1.2.6` with `npm install --save-exact`. These are needed by items 5–7; do them first so later typecheck/build steps resolve.
      Files: `package.json`, `package-lock.json`
      Verify: `npm ls @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch` lists all three with no `UNMET`/peer errors; `package.json` shows exact (no `^`) versions for the three.

- [ ] 2. Rewrite `button.tsx` to the Figma matrix while preserving the `Button` + `buttonVariants` + `asChild`/`Slot` API.
      Replace the `buttonVariants` cva with three axes: `variant` (`primary`|`secondary`|`destructive`|`inverse`), `appearance` (`filled`|`outline`|`ghost`), `size` (`sm`|`md`|`lg`). Keep the base classes (`inline-flex items-center justify-center gap-2 ... [&_svg]:size-4 ... focus-visible:ring-ring/50 focus-visible:ring-[3px]`). Use `compoundVariants` for the variant×appearance combinations so filled uses `bg-{type} border-{type}-... text-*-foreground hover:bg-{type}-hover active:bg-{type}-pressed`, outline uses `border bg-transparent text-{type} hover:bg-{type}-light active:bg-{type}-light-strong`, ghost uses `bg-transparent text-{type} hover:bg-{type}-light active:bg-{type}-light-strong` (no border). Sizes: `sm` = `h-[34px] rounded-sm px-2 py-2`, `md` = `h-[46px] rounded-md px-3 py-3`, `lg` = `h-[58px] rounded-lg px-4 py-4` (8/12/16px = p-2/p-3/p-4). Inverse filled: `bg-primary-foreground text-primary hover:bg-primary-light active:bg-primary-light-strong`. Disabled via `disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground disabled:pointer-events-none` (drop `disabled:opacity-50`). `defaultVariants: { variant: "primary", appearance: "filled", size: "md" }`. Keep `data-slot="button"` and the `Comp = asChild ? Slot : "button"` logic unchanged.
      Files: `src/components/ui/button.tsx`
      Verify: `npx vitest run src/components/ui/button.test.tsx` — all 3 existing tests pass unchanged.

- [ ] 3. Keep `button.test.tsx` green; add tests only for genuinely new public behavior.
      The three existing tests must still pass as-is. Add minimal tests covering the new axes: a `variant="destructive" appearance="outline"` render asserting the element is in the document, and a `size="lg"` render — asserting role/presence only (not exact class strings, to avoid brittleness). Do not assert on token hex values.
      Files: `src/components/ui/button.test.tsx`
      Verify: `npx vitest run src/components/ui/button.test.tsx` — all tests (old + new) pass.

- [ ] 4. Rewrite `input.tsx` to the Figma Input Field spec with size, error, and icon slots.
      Add a `inputVariants` cva with `size` (`sm` = `h-[34px] rounded-sm px-2 py-2 text-sm`, `md` = `h-[46px] rounded-md px-3 py-3 text-sm`). Base: `w-full min-w-0 border bg-muted text-foreground placeholder:text-muted-foreground border-border transition-colors outline-none hover:border-primary hover:bg-primary-light focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground`. Add `error?: boolean` prop → sets `aria-invalid` and `aria-invalid:border-destructive aria-invalid:text-destructive` classes (keep the existing `aria-invalid:` utilities). Add optional `startIcon`/`endIcon: React.ReactNode`: when present, wrap the `<input>` in a `relative` container, render icons in an absolutely positioned span using logical insets (`absolute inset-y-0 start-0 flex items-center ps-2` / `end-0 pe-2`) with `text-muted-foreground`, and add logical padding to the input (`ps-9`/`pe-9`) so it works in both `dir=rtl` and `dir=ltr`. Keep `data-slot="input"`, `forwardRef` is not used in the current file (it is a plain function component) — keep it a function component to match, but forward the `ref` via `React.ComponentProps<"input">` is not enough for a ref; use `React.forwardRef<HTMLInputElement, ...>` here since consumers (react-hook-form `FormControl`/`Slot`) pass refs. Set `displayName = "Input"`.
      Files: `src/components/ui/input.tsx`
      Verify: `npm run typecheck` passes; `npx vitest run src/components/ui` passes (no input test exists yet, so this confirms no regression).

- [ ] 5. Create `textarea.tsx` mirroring Input styling, multiline.
      New `TextArea` as `React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea"> & { error?: boolean }>`. Reuse the same base/border/hover/focus/disabled classes as Input (minus fixed height; use `min-h-[92px] py-3 px-3 rounded-md` resize-y). Support the `error` prop identically (aria-invalid + destructive). `data-slot="textarea"`, `displayName = "TextArea"`. No icon slots. `"use client"` not required (no hooks/Radix), but add it only if a hook is introduced.
      Files: `src/components/ui/textarea.tsx`
      Verify: `npm run typecheck` passes.

- [ ] 6. Create `checkbox.tsx` wrapping `@radix-ui/react-checkbox`.
      `"use client"`. `Checkbox = React.forwardRef<..., React.ComponentProps<typeof CheckboxPrimitive.Root>>` rendering `CheckboxPrimitive.Root` + `CheckboxPrimitive.Indicator` with a lucide `Check` icon (`size-3.5`, `text-primary-foreground`). Classes: `peer size-4 shrink-0 rounded-[4px] border border-border bg-transparent outline-none transition-colors hover:border-primary hover:bg-primary-light focus-visible:ring-ring/50 focus-visible:ring-[3px] data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground disabled:cursor-not-allowed disabled:border-muted-foreground disabled:text-muted-foreground disabled:bg-muted`. `data-slot="checkbox"`. (Radix `Root` already renders a native-equivalent accessible control; label gap-8 and `text-xsm` are the consumer's responsibility via `Label` — note in a JSDoc example that pairing with `<Label className="gap-2">` yields the Figma 8px gap.) If item 1's checkbox version failed to resolve, instead build an accessible native `<input type="checkbox" className="peer sr-only">` + styled sibling box with the same classes and `aria`/`id` wiring — no new dep.
      Files: `src/components/ui/checkbox.tsx`
      Verify: `npm run typecheck` passes; `npm run lint` reports no errors for the file.

- [ ] 7. Create `radio-group.tsx` wrapping `@radix-ui/react-radio-group`.
      `"use client"`. Export `RadioGroup` (wraps `RadioGroupPrimitive.Root`, `className="grid gap-2"`, `data-slot="radio-group"`) and `RadioGroupItem` (wraps `RadioGroupPrimitive.Item` + `RadioGroupPrimitive.Indicator` with a filled dot — a lucide `Circle`/inner span `size-2 rounded-full bg-primary`). Item classes: `aspect-square size-4 rounded-full border border-border text-primary outline-none transition-colors hover:border-primary hover:bg-primary-light focus-visible:ring-ring/50 focus-visible:ring-[3px] data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:border-muted-foreground disabled:text-muted-foreground`. Both `forwardRef`. Fallback to accessible native `<input type="radio">` group if item 1's radio-group version failed — no new dep.
      Files: `src/components/ui/radio-group.tsx`
      Verify: `npm run typecheck` passes; `npm run lint` reports no errors for the file.

- [ ] 8. Create `switch.tsx` wrapping `@radix-ui/react-switch`.
      `"use client"`. `Switch = React.forwardRef<..., React.ComponentProps<typeof SwitchPrimitive.Root>>` rendering `SwitchPrimitive.Root` + `SwitchPrimitive.Thumb`. Root classes: `peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] data-[state=checked]:bg-primary data-[state=checked]:border-primary-hover data-[state=unchecked]:bg-muted data-[state=unchecked]:border-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:border-muted-foreground`. Thumb: `pointer-events-none block size-5 rounded-full bg-primary-foreground shadow transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-5` (RTL-correct thumb travel). `data-slot="switch"`. Fallback to an accessible `<button role="switch" aria-checked>` implementation if item 1's switch version failed — no new dep.
      Files: `src/components/ui/switch.tsx`
      Verify: `npm run typecheck` passes; `npm run lint` reports no errors for the file.

- [ ] 9. Export every new/updated atom from the UI barrel.
      Add exports: `TextArea` from `./textarea`; `Checkbox` from `./checkbox`; `RadioGroup, RadioGroupItem` from `./radio-group`; `Switch` from `./switch`. `Button`/`buttonVariants` and `Input` exports already exist — keep them (Input now also could export `inputVariants` if defined; export it alongside `Input`).
      Files: `src/components/ui/index.ts`
      Verify: `npm run typecheck` passes (confirms all re-exported symbols exist).

- [ ] 10. Full verification gate — run the complete suite and fix every failure.
      Run all four commands from repo root. Fix any type error, lint error, failing test, or build error introduced by items 1–9 before considering the stage done.
      Files: (none — verification only)
      Verify, in order: - `npm run typecheck` — zero errors. - `npm run lint` — zero errors. - `npm run test` — all tests pass, including `button.test.tsx`. - `npm run build` — succeeds.

---

## Digest

Build commands (confirmed from `package.json` scripts): `npm run typecheck` (`tsc --noEmit`), `npm run lint` (`eslint`), `npm run test` (`vitest run`), `npm run build` (`next build`). Test setup (confirmed `vitest.config.ts`): jsdom env, globals on, `@/*` alias via `vite-tsconfig-paths`, matches `src/**/*.{test,spec}.{ts,tsx}`. Baseline today: `button.test.tsx` is the only UI test (3 tests: renders children, disabled attribute, asChild→anchor). The new atoms consume stage-1 tokens only; `globals.css` already defines every `*-hover/-pressed/-light/-light-strong` variable used above (verified).

### `package.json` (+ `package-lock.json`) — item 1

- Add to `dependencies`, exact (no caret): `@radix-ui/react-checkbox` `1.3.3`, `@radix-ui/react-radio-group` `1.3.8`, `@radix-ui/react-switch` `1.2.6`. Installed peers today: `@radix-ui/react-primitive` `2.2.0`, `@radix-ui/react-slot` `1.5.0`, `react`/`react-dom` `19.3.0`, `lucide-react` `^0.562.0` (has `Check`, `Circle`).
- Covered by: items 6/7/8 typecheck+build. Fallback if a pin fails to resolve: native-element implementation, no dep (noted per item).

### `src/components/ui/button.tsx` — item 2

- Current export surface (keep): `function Button({ className, variant, size, asChild, ...props })` returning `<Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} />` with `Comp = asChild ? Slot : "button"`; `export { Button, buttonVariants }`.
- Change: `buttonVariants` cva gains `appearance` axis + `compoundVariants`; `size` enum becomes `sm|md|lg`; `variant` enum becomes `primary|secondary|destructive|inverse`; `Button` props destructure adds `appearance`; `buttonVariants({ variant, appearance, size, className })`.
- Test covering it: `src/components/ui/button.test.tsx`. Verified today: the 3 tests pass and reference no `variant`/`size` string, so the enum rename is safe.

### `src/components/ui/button.test.tsx` — item 3

- Current: 3 `it` blocks (children / disabled / asChild). Add 2 presence-only tests for new axes. Keep imports (`describe,it,expect`, `render,screen`, `Button`).

### `src/components/ui/input.tsx` — item 4

- Current: plain `function Input({ className, type, ...props }: React.ComponentProps<"input">)`, `export { Input }`, `data-slot="input"`.
- Change to: `React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & VariantProps<typeof inputVariants> & { error?: boolean; startIcon?: React.ReactNode; endIcon?: React.ReactNode }>`; add `inputVariants` cva (`size` sm/md); icon-wrapper with logical insets; `displayName = "Input"`; `export { Input, inputVariants }`.
- Test covering it: none today; guarded by `npm run typecheck` + `npx vitest run src/components/ui` (no regression) + `npm run build`.

### `src/components/ui/textarea.tsx` — item 5 (new)

- `TextArea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea"> & { error?: boolean }>`; `data-slot="textarea"`; `export { TextArea }`. Covered by typecheck + build.

### `src/components/ui/checkbox.tsx` — item 6 (new)

- `"use client"`; wraps `@radix-ui/react-checkbox` Root+Indicator (lucide `Check`); `forwardRef`; `data-slot="checkbox"`; `export { Checkbox }`. Covered by typecheck + lint + build.

### `src/components/ui/radio-group.tsx` — item 7 (new)

- `"use client"`; `RadioGroup` (Root) + `RadioGroupItem` (Item+Indicator dot); both `forwardRef`; `data-slot` `radio-group`/`radio-group-item`; `export { RadioGroup, RadioGroupItem }`. Covered by typecheck + lint + build.

### `src/components/ui/switch.tsx` — item 8 (new)

- `"use client"`; wraps `@radix-ui/react-switch` Root+Thumb with RTL-aware thumb translate; `forwardRef`; `data-slot="switch"`; `export { Switch }`. Covered by typecheck + lint + build.

### `src/components/ui/index.ts` — item 9

- Current barrel exports `Button, buttonVariants`, `Input`, `Label`, plus Card/Skeleton/Avatar/Badge/Separator/Tabs/Dialog/Sheet/DropdownMenu/Select/Tooltip/Form. Add: `TextArea`, `Checkbox`, `RadioGroup`, `RadioGroupItem`, `Switch`, and `inputVariants` alongside `Input`. Guarded by `npm run typecheck`.

### Final gate — item 10

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` all pass with zero errors. `button.test.tsx` stays green.
