# Review — Stage 2B (display/selection atoms)

Commits reviewed: `d811798` (feat: add stage 2B display/selection atoms) and `3645fc2` (fix: make Tag remove affordance keyboard-operable), diffed against `eb66719` (stage 2A).

Verdict: **APPROVED**

## Verification evidence (from commit messages, not re-run)

Both commits record, at repo root in PowerShell:

- `npm run typecheck`: pass
- `npm run lint`: pass (0 errors, 1 pre-existing warning)
- `npm run test`: pass (34 tests, 8 files)
- `npm run build`: pass

Required verification is present and complete.

## Scope checked against `figma-tokens.md`

### 1. Badge (`src/components/ui/badge.tsx`)

- Shape: `rounded-full px-3 py-2 gap-1 border` = radius full, padding x12 y8, gap 4, border 1. Matches spec.
- cva extended with `variant` (primary/secondary/accent/warning/error/inverse) and `tone` (default/light) via `compoundVariants`; `defaultVariants` = primary/default.
- Color mappings verified against tokens in `globals.css`:
  - Primary default `bg-primary` (#123458) / `text-primary-foreground` (#fafafa); light `bg-primary-light-strong` (#d9e6f2) / `text-primary`. ✓
  - Secondary default `bg-secondary` (#14b8a6) / fg #fafafa; light `bg-secondary-light-strong/50` (#ccfbf1 @ ~50% alpha, matches `#ccfbf180`) / `text-secondary`. ✓
  - Accent default `bg-accent` (#0f766e) / fg #fafafa; light `bg-accent-light` (#ccfbf1) / `text-accent`. ✓
  - Warning default `bg-warning` (#df900a) / fg #fafafa; light `bg-warning-light` (#fef3c7) / `text-warning`. ✓
  - Error `bg-destructive-light-strong` (#fee2e2) / `text-destructive` (#ef4444) for both tones — matches the single Error spec. ✓
  - Inverse `bg-primary-foreground` (#fafafa) / `text-primary` (#123458). ✓
- focus-visible ring uses `ring-ring/50 ring-[3px]` (ring token). ✓

Note (non-blocking): the stage-2A Badge `variant` values (`default`/`destructive`/`outline`) were replaced rather than extended. The task says "keep existing call sites compiling." A repo-wide search found no Badge call sites using the removed values (only Button/DropdownMenuItem use `destructive`/`outline`), and bare `<Badge>` still resolves via `defaultVariants: primary`. Typecheck passes. No reachable breakage, so not a blocker.

### 2. Tag (`src/components/ui/tags.tsx`, new)

- Shape: `rounded-sm p-2 gap-2 border` = radius 8, padding 8, gap 8, border 1. ✓
- States via `selected` cva variant:
  - Default (false): `border-muted-foreground bg-muted text-muted-foreground` = #a1a1aa / #f4f4f5 / #a1a1aa. ✓
  - Hover (false only): `hover:border-primary hover:bg-primary-light hover:text-primary` = #123458 / #eff5fa / #123458. ✓
  - Selected/Pressed (true): `border-primary-foreground bg-primary text-primary-foreground` = #fafafa / #123458 / #fafafa. ✓
  - Disabled: `has-[:disabled]:` → muted fg/border + muted bg, pointer-events-none. ✓
- Controllable `selected` prop reflected to `data-state` and `aria-pressed`. ✓
- Optional leading `icon` and removable close affordance (`onRemove`, `removeLabel`). ✓
- a11y (from fix commit `3645fc2`): body and remove controls are sibling native `<button>`s inside a non-interactive `<span>`; both tab-focusable and Enter/Space operable, each with a `focus-visible` ring using the ring token. Remove click stops propagation. Resolves the prior keyboard-operability blocker. ✓
- Tests cover label render, selected reflection, onRemove activation, disabled.

### 3. Select trigger (`src/components/ui/select.tsx`)

- `rounded-sm` (8), `px-2` (8), `border border-border` (#e4e4e7), `gap-2` (8), `bg-muted` (#f4f4f5), `text-muted-foreground` (#a1a1aa). ✓
- `size` prop `sm | lg` via `data-size`: `lg → py-3` (12), `sm → py-2` (8). Default `lg`. ✓
- Hover: `hover:border-primary hover:bg-primary-light hover:text-primary` (+ icon color). ✓
- focus-visible uses `border-ring ring-ring/50 ring-[3px]`. ✓
- Logical properties: item uses `pe-8 ps-2`, indicator `end-2`. ✓
- Content/item styling token-based; dark mode via tokens.

### 4. Label (`src/components/ui/label.tsx`)

- `text-foreground` (#18181b), `text-base leading-6` (16/24), `font-medium` (500). ✓
- Radix `LabelPrimitive.Root` retained; form.tsx integration unchanged. ✓

### 5. Separator / Skeleton / Spinner

- Separator: `bg-border` token, h-px/w-px orientation. Not drifting; left unchanged. ✓
- Skeleton: changed from teal accent to `bg-muted` + `rounded-md`. Correct token alignment. ✓
- Spinner (`src/components/shared/spinner.tsx`): `text-muted-foreground`, `role="status"` + sr-only label. Not drifting; left unchanged. ✓

## Cross-cutting requirements

- TypeScript throughout; `cn` + `cva` used; `VariantProps` typing. ✓
- Exports: `Badge`/`badgeVariants`, `Tag`/`tagVariants`, `Select*`, `Label`, `Skeleton`, `Separator` all barrel-exported from `src/components/ui/index.ts`. ✓
- a11y: focus-visible rings use the ring token across Badge/Tag/Select. ✓
- RTL/LTR: logical properties (`ps`/`pe`, `end-`) used where directional; Badge/Tag rely on symmetric `px`/`p`/`gap`. ✓
- Light + dark: all colors resolve through `globals.css` tokens with `.dark` overrides. ✓
- No new dependencies (icons from existing `lucide-react`). ✓
- Tokens, font, and stage-2A atoms not modified beyond the Skeleton token fix (within the "adjust only if drifting" allowance) and re-exports. ✓

## Blockers

None.
