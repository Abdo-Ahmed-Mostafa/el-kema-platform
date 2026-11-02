# Implementation Plan — Figma AUTH screens (pixel-perfect)

Source of truth: `.agents/design-system/figma-auth.md` + `.agents/design-system/figma-tokens.md`. Figma fileKey `y0eOLyKLtTHnJYzOW046WR`. Windows/PowerShell — chain with `;` not `&&`. Gates (repo root): `npm run typegen` ; `npm run typecheck` ; `npm run lint` ; `npm run test` ; `npm run build`.

Design decisions (made here, grounded in the codebase):

- **Subtitle/body color `#52525a`** already exists as the `--text-body` token → `text-text-body` utility. Reuse it; do not add a new color.
- **Auth card radius 24px** already exists as `--radius-card-xl` → `rounded-card-xl`. The new `--card-auth-radius` must equal it (reuse, don't duplicate the utility). Only `--card-auth-surface` (#f4f4f5) and `--card-auth-border` (#a1a1aa) are genuinely new.
- **Spacing** maps cleanly to Tailwind defaults: card padding 24 = `p-6`, section gap 48 = `gap-12`, sub-section gap 24 = `gap-6`, heading gap 12 = `gap-3`, input-field gap 12 = `gap-3`, field width 578 is the card content width (use `w-full`, the 578 comes from the 628-wide card minus padding — in-app the card is flex-1 so fields are `w-full`).
- **Icons**: `EmailIcon` (Mail) and `PasswordIcon` (Lock) from `@/components/icons`; eye toggle via the `PasswordToggle` molecule. Logo via existing `LogoMark` (node 89:4902) — do NOT download the logo SVG.
- **Multi-step Sign Up**: keep `react-hook-form` + the existing `createRegisterSchema` as the single form; split rendering into step 1 (role + identity) and step 2 (remaining fields) with local `step` state inside `RegisterForm`. Submit contract (`useRegister`, payload shape, field names) is unchanged. Role selection uses `SelectableCardGroup` bound to the `role` field via RHF `Controller`.
- **Forgot-password**: Figma has no dedicated node → compose from the shared shell + a single email Input + submit Button, copy consistent with Login. No new API; wire a no-op/local submit that mirrors Login's field pattern (keep it typed, no behavior regression).
- **`auth` i18n**: extend the `auth` namespace in BOTH `messages/ar.json` and `messages/en.json` in sync. The messages-parity test only checks `organisms`, but keep `auth` key sets identical anyway.

---

- [ ] 1. Add additive "Card Authentication" tokens to `globals.css`.
      Add to `:root`: `--card-auth-surface: oklch(0.967 0.001 286.4);` (#f4f4f5, same as `--muted`) and `--card-auth-border: oklch(0.712 0.013 286.1);` (#a1a1aa, same as `--muted-foreground`). Add dark overrides in `.dark` consistent with the muted treatment. In `@theme inline` expose `--color-card-auth-surface` and `--color-card-auth-border`. Reuse existing `--radius-card-xl` (24px) for the radius — do NOT add a new radius utility. Do NOT touch existing tokens.
      Files: `src/app/globals.css`
      Verify: `npm run build` compiles; `bg-card-auth-surface` / `border-card-auth-border` resolve (grep is not enough — confirm via build).

- [ ] 2. Build the shared auth shell in `(auth)/layout.tsx`.
      Rework into the Figma split layout: a centered row (`max-w-[1280px]`, `gap-6`, `items-center`) with a 628px-wide image column (`rounded-card-xl`, `next/image` fill, `object-cover`, hero from `public/auth/hero.png`) and a flex-1 auth card (`bg-card-auth-surface`, `border border-card-auth-border`, `rounded-card-xl`, `p-6`, `flex flex-col items-center gap-12`). On mobile (`< lg`) hide/stack the image column gracefully and keep the card full-width. Keep it a Server Component; keep `setRequestLocale`; keep the `LayoutProps<"/[locale]">` signature and default export. Logical properties only.
      Files: `src/app/[locale]/(auth)/layout.tsx`, `public/auth/hero.png` (downloaded in step 3)
      Verify: `npm run typecheck` ; `npm run build` — all three auth routes render the shell.

- [ ] 3. Download the auth hero image into `public/auth/`.
      From the Login `get_design_context` output, the hero is the `image 4` PNG asset. Fetch with `curl -L "<asset-url>" -o public/auth/hero.png`. Never reference the temporary Figma URL at runtime. If sign-up flows use a different hero, download those too (e.g. `public/auth/hero-signup.png`).
      Files: `public/auth/hero.png`
      Verify: file exists and is a valid PNG (`npm run build` succeeds with `next/image` referencing it).

- [ ] 4. Extend the `auth` i18n namespace in ar + en (in sync).
      Add keys for the Figma copy: login heading "قم بتسجيل الدخول إلى حسابك" / subtitle "أدخل بيانات اعتمادك للوصول إلى حسابك"; email label "الايميل الشخصي" + placeholder "قم بادخال ايميلك الشخصي"; password label "كلمة السر" + placeholder "قم بادخال كلمة السر"; forgot link "هل نسيت كلمة السر ؟"; submit "تسجيل الدخول"; footer "ليس لديك حساب؟" + "سجل الآن"; plus sign-up step labels/social-button labels discovered from the sign-up nodes. Keep English sensible and the key sets identical across both files.
      Files: `messages/ar.json`, `messages/en.json`
      Verify: `npm run test` (messages-parity stays green) ; `npm run typecheck`.

- [ ] 5. Rebuild the Login page + `LoginForm` markup to match node 47:3798 pixel-for-pixel.
      Page (`login/page.tsx`): drop the `Card` wrapper (the shell card replaces it); render `LogoMark` (140×144), heading block (`gap-3`, title = Paragraph lg Semibold `text-foreground`, subtitle = Paragraph xsm `text-text-body`), then `<LoginForm />`, then the footer line ("ليس لديك حساب؟" + secondary underlined "سجل الآن" link to register). Keep `generateMetadata` + `setRequestLocale`.
      `LoginForm`: keep RHF + `createLoginSchema` + `useLogin` + field names (`email`/`password`/`rememberMe`) + submit handler. Restructure markup: fields block `flex flex-col gap-6 w-full`; each field `flex flex-col gap-3`, label (Paragraph sm Medium) with red `*`, `Input` (md) — email with trailing `EmailIcon`, password using `usePasswordToggle` (leading eye toggle) + trailing `PasswordIcon`; secondary underlined "forgot password" link full-width; full-width primary `Button` (md). Logical properties; RTL text-align end.
      Files: `src/app/[locale]/(auth)/login/page.tsx`, `src/features/auth/components/login-form.tsx`
      Verify: `npm run typecheck` ; `npm run lint` ; `npm run test` ; then `get_screenshot` on 47:3798 and compare, iterate until no 1px drift.

- [ ] 6. Build the multi-step Sign Up (general flow: node 89:4922 step 1, node 221:1217 step 2).
      Fetch both nodes via `get_design_context` for exact fields/layout. Rework `RegisterForm` into a 2-step form over the SAME RHF form/schema: step 1 = role selection (`SelectableCardGroup` via RHF `Controller` on `role`, options Student/Parent/Teacher from `roleList` + role icons) + identity fields (firstName/lastName/email per Figma); step 2 = remaining fields (password/confirmPassword) + social sign-in buttons (`GoogleIcon`/`FacebookIcon`/`AppleIcon` in ghost/outline Buttons). Local `step` state; a "next" button validates step-1 fields via `trigger([...])` before advancing; final submit keeps the existing `useRegister` payload (strip `confirmPassword`). Keep public export `RegisterForm` intact.
      Register page: same shell treatment as Login (logo + heading + `<RegisterForm />` + footer "لديك حساب؟" + login link).
      Files: `src/features/auth/components/register-form.tsx`, `src/app/[locale]/(auth)/register/page.tsx`
      Verify: `npm run typecheck` ; `npm run lint` ; `npm run test` ; `get_screenshot` on 89:4922 and 221:1217, iterate to pixel match.

- [ ] 7. Rework the Forgot-password page to the shared shell.
      Compose from the shell: logo + heading ("نسيت كلمة المرور؟" + subtitle) + a single email `Input` (with `EmailIcon`, label + red `*`) + full-width primary submit `Button` + a secondary link back to Login. Use a small client form component (new `forgot-password-form.tsx` in `src/features/auth/components`, or inline client form) with RHF + a minimal email zod schema reusing the `emailRequired`/`emailInvalid` messages; submit can be a typed no-op placeholder (no API endpoint exists) — do not fabricate backend calls. Keep `setRequestLocale`.
      Files: `src/app/[locale]/(auth)/forgot-password/page.tsx`, (optional) `src/features/auth/components/forgot-password-form.tsx` + export in `src/features/auth/index.ts`
      Verify: `npm run typecheck` ; `npm run lint` ; `npm run test`.

- [ ] 8. Full integration gate + commit.
      Run all gates from repo root in order: `npm run typegen` ; `npm run typecheck` ; `npm run lint` ; `npm run test` ; `npm run build`. Fix every failure. Do a final `get_screenshot` pass on 47:3798, 89:4922, 221:1217. Commit to `main`.
      Verify: all five gates pass with 0 errors; screenshots match.

## Digest

- `src/app/globals.css` — `:root` block (ends at `--text-body`), `.dark` block, `@theme inline` block. Add `--card-auth-surface` / `--card-auth-border` to `:root` + `.dark`, and `--color-card-auth-surface` / `--color-card-auth-border` to `@theme inline`. Reuse `--radius-card-xl`. No test; verified by `npm run build`.
- `src/app/[locale]/(auth)/layout.tsx` — default `AuthLayout({children, params}: LayoutProps<"/[locale]">)`, Server Component, currently a centered `<main>` with `<Logo />`. Replace body with split-screen shell. Verified by `npm run build`.
- `src/app/[locale]/(auth)/login/page.tsx` — `generateMetadata` + default `LoginPage`. Remove `Card*` imports/usage; render logo+heading+`LoginForm`+footer. Verified by build + get_screenshot 47:3798.
- `src/features/auth/components/login-form.tsx` — `LoginForm()` client component, RHF `useForm<LoginValues>` with `createLoginSchema(tv)`, `useLogin()`, fields email/password/rememberMe. Markup restructured; contracts unchanged. Covered by `src/features/auth/schemas.test.ts` (schema unchanged). Verified by `npm run test`.
- `src/features/auth/components/register-form.tsx` — `RegisterForm()` client component, RHF `useForm<RegisterValues>` with `createRegisterSchema(tv)`, `useRegister()`, fields firstName/lastName/email/password/confirmPassword/role. Add local step state + `SelectableCardGroup` via `Controller`; submit contract unchanged. Covered by `schemas.test.ts`. Verified by `npm run test`.
- `src/app/[locale]/(auth)/register/page.tsx` — `generateMetadata` + default `RegisterPage`. Shell treatment. Verified by build + get_screenshot 89:4922 / 221:1217.
- `src/app/[locale]/(auth)/forgot-password/page.tsx` — default `ForgotPasswordPage`. Shell treatment + email form. Verified by typecheck/lint/test.
- `src/features/auth/index.ts` — public barrel; if a `ForgotPasswordForm` is added, export it here. Keep existing exports intact.
- `messages/ar.json` + `messages/en.json` — `auth` namespace (and `auth.validation`, `auth.roles`, `auth.success`, `auth.errors` subtrees). Add new keys in both, in sync. Covered by `src/components/organisms/messages-parity.test.ts` (organisms only, but keep auth parity too). Verified by `npm run test`.

Build command: `npm run build`. Test command: `npm run test` (vitest). Tests passing today: `src/features/auth/schemas.test.ts`, `src/components/organisms/messages-parity.test.ts`, and the component/icon suites — keep all green.
