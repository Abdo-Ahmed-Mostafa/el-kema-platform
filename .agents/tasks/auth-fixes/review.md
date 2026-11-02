# Real Figma auth icons, numeric-only phone/national-id, sticky public navbar

The commit (`8dcd388`) delivers all three fixes from the spec. FIX 1 replaces the lucide approximations for the auth input glyphs with hand-authored Figma SVGs under `src/components/icons/ui/`, keeps the semantic export names (`PersonIcon`, `PhoneIcon`, `CardIdIcon`, `EmailIcon`, plus the eye glyphs behind the password toggle), and bumps the input icon from 16px to 24px with `ps-10`/`pe-10` padding (edge 8 + icon 24 + gap 8). FIX 2 adds a `useNumericField` hook that strips non-digits on change and paste for phone (max 11) and nationalId (max 14), drops the `+20`/`0020` prefix, and tightens the zod phone regex to a plain Egyptian 11-digit rule with matching tests. FIX 3 bumps the public navbar to `z-50` (it was already `sticky top-0`), leaves the auth group with no navbar, and leaves dashboards on their own chrome. The commit message records typegen OK, typecheck 0 errors, lint 0 errors, 152/152 tests, and a successful build.

Watch for: the register fields replace react-hook-form's `register` onChange rather than composing with it (likely — behaviorally correct here but worth understanding); `type="tel"`'s `inputMode="tel"` was intentionally replaced with `inputMode="numeric"` (confirmed, matches spec). No blocking issues.

**Verdict**: APPROVED

## High-level view

The icon work is a clean swap: six new typed components in `src/components/icons/ui/` carry the real Figma path data, inherit `currentColor`, default to `size=24`, and spread `...props` so `className` and `size` both work. The barrel (`icons/index.ts`) re-exports them and the lucide barrel stops re-exporting the four auth names, so every call site resolves to the Figma glyph. Because `PersonIcon` is shared, three dashboard organisms now get the new glyph too — this is the spec-sanctioned "update the shared icon" path, and those call sites pass `className="size-5"` which overrides the default size correctly.

The input padding change is consistent: both `startIcon`/`endIcon` reserve `ps-10`/`pe-10` and the icon spans render at `[&_svg]:size-6` (24px) with `ps-2`/`pe-2` (8px) edge offset, all logical properties. This matches the Figma 8/24/8 spec and stays RTL-correct.

The numeric enforcement lives in one small hook returning `onChange`, `inputMode="numeric"`, `pattern="[0-9]*"`, and `maxLength`. It sanitizes through `setValue` with `shouldValidate`/`shouldDirty`, so typed, pasted, and autofilled values are all cleaned at the source. The schema and its tests were updated together: the phone regex `^01[0125]\d{8}$` agrees exactly with the digits-only, 11-char input.

The navbar change is minimal and correct for the stated interpretation: public navbar on the public group only, no stacking on dashboards, none on auth.

<details>
<summary>Issues (2)</summary>

1. **onChange override vs compose** — the register fields spread `{...register("phone")}` then `{...phoneNumeric}`, so the hook's `onChange` replaces RHF's registered `onChange`. The hook re-commits via `setValue(..., { shouldValidate, shouldDirty })`, so form state stays correct, but the field value now flows solely through `setValue`. No action required; noted for maintainers who might expect the two handlers to chain.
2. **Shared PersonIcon affects dashboards** — `PersonIcon` is consumed by `recent-activity-course.tsx`, `student-data.tsx`, and `student-overview.tsx` at `size-5`. The glyph shape changed (lucide User → Figma person-in-circle). This is intended per spec, but is a visual change outside the auth screens; confirm the new glyph reads well at 20px in those dashboard contexts.

</details>

<details>
<summary>Details</summary>

### Icon swap and the shared-name strategy

The four auth glyphs plus the two eye icons are now real SVGs with the Figma node ids recorded in each file's doc comment (Person 107:698, Phone 107:712, Card ID 358:2720, Email 73:4703, Eye 73:4731, Eye-closed 309:2318). They share a `UiIconProps` type that omits `width`/`height` from `SVGProps` and adds a numeric `size` (default 24), and each sets `aria-hidden` unless an `aria-label` is passed — the same decorative-by-default contract lucide had. The lucide barrel keeps only `PasswordIcon` (the lock) and documents why the other four are gone, which prevents an accidental re-export clobbering the Figma versions.

The spec required backing the existing semantic names (held: `login-form`, `forgot-password-form`, and `register-form` needed no signature changes) and preferring a shared update over a localized one. The thing to eyeball is the dashboard usages at `size-5` (issue 2) — they override the 24px default through the `size-*` utility on the spread `className`, so sizing is correct; it's the glyph shape, not the size, that changed.

### Input icon geometry

All padding uses logical properties (`ps-10`/`pe-10` on the input, `ps-2`/`pe-2` on the icon span, `start-0`/`end-0`, `inset-y-0`), so RTL is preserved and the auth fields — which pass `endIcon`, landing on the start side in RTL — place the glyph where Figma shows it. The `[&_svg]:size-6` (24px) icon inside a 46px field with py-12 clears vertically.

### Numeric enforcement and schema agreement

The behavioral note (issue 1): spreading `phoneNumeric` after `register("phone")` means the hook's `onChange` wins over the one `register` installed. It works because `setValue` drives RHF state and `register`'s `name`/`ref`/`onBlur` are still applied — the field is sanitized-controlled through `setValue` while remaining registered. Worth knowing when editing these fields later, but not a defect.

The phone rule changed from `^(?:\+20|0020|0)?1[0125]\d{8}$` to `^01[0125]\d{8}$`, which is exactly what the digits-only, 11-char input can produce (010/011/012/015 + 8 digits). The new tests assert the plain 11-digit form passes, that `+20`/`0020`-prefixed values fail (they can't be typed anyway), and that a wrong operator digit (`013...`) fails. nationalId stays "exactly 14 digits" and the input caps at 14. `type="tel"` is kept for phone; `inputMode="tel"` was swapped to `inputMode="numeric"` via the hook on both fields, matching the spec.

### Bundled change: auth hero stretch

The commit also switches the auth shell row from a fixed `h-[748px] w-[628px]` hero to `items-stretch` + `self-stretch` so the hero matches card height on both the short login card and the tall register card. It's an unrelated layout tweak bundled into the fix commit, documented in the layout comment and low-risk, but it is outside the three stated fixes.

### Test coverage

The phone-rule changes are covered by three added cases in `schemas.test.ts` (plain 11-digit accepted, prefixed rejected, wrong-operator rejected), and the commit reports 152/152 passing. Not tested: the `useNumericField` sanitizer itself (no unit test exercising paste/non-digit stripping) and the input icon rendering/padding. These are UI-level behaviors the coder verified via screenshots per the commit message rather than automated tests; acceptable for this change, but the sanitizer is pure logic that would be cheap to cover if regressions appear.

</details>

<details>
<summary>File map</summary>

- `src/components/icons/ui/{person,phone,card-id,email,eye,eye-closed}.tsx` — new typed Figma SVG glyph components (currentColor, size default 24).
- `src/components/icons/ui/types.ts` — shared `UiIconProps` (omits width/height, adds numeric `size`).
- `src/components/icons/ui/index.ts` — barrel for the new glyphs.
- `src/components/icons/index.ts` — re-exports `./ui`.
- `src/components/icons/lucide.ts` — stops re-exporting the four auth names; keeps `PasswordIcon`.
- `src/components/molecules/password-toggle.tsx` — uses `EyeIcon`/`EyeClosedIcon` instead of lucide.
- `src/components/ui/input.tsx` — `ps-10`/`pe-10` padding, `[&_svg]:size-6` (24px) icon spans.
- `src/features/auth/components/use-numeric-field.ts` — new digits-only hook.
- `src/features/auth/components/register-form.tsx` — wires the hook into phone/nationalId.
- `src/features/auth/schemas.ts` — phone regex simplified to `^01[0125]\d{8}$`.
- `src/features/auth/schemas.test.ts` — phone-rule tests updated/added.
- `src/components/shared/navbar.tsx` — `z-40` → `z-50`.
- `src/app/[locale]/(auth)/layout.tsx` — hero stretch (bundled layout tweak).

Full diff: `git -C d:\devs\El-Kema-platform show 8dcd388`

</details>
