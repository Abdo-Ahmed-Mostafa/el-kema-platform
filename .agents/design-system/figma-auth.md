# Figma Auth Screens — El-Kema (integration, pixel-perfect)

Source: Figma file `y0eOLyKLtTHnJYzOW046WR`, page **"UI"** (47:3797). Goal: make the project's auth pages match Figma EXACTLY (1px-perfect), using the already-built design system (atoms/molecules/tokens). The core palette/font are already live (navy primary #123458, IBM Plex Sans Arabic).

## Screen inventory (all 1440×1024 desktop, split layout: 628px image column + form card)

| Flow (section)              | Login   | Sign Up 1 | Sign Up 2 |
| --------------------------- | ------- | --------- | --------- |
| General Register (358:2671) | —       | 89:4922   | 221:1217  |
| Student Flow (168:1263)     | 47:3798 | 254:1634  | 309:2191  |
| Parent Flow (168:1264)      | —       | 356:2564  | 358:2723  |
| Instructor Flow (168:1431)  | —       | 368:2998  | 393:3353  |

Use the figma power `get_design_context` on each node id (fileKey y0eOLyKLtTHnJYzOW046WR) for the exact layout, then ADAPT to the project (tokens/atoms) — never paste raw Figma Tailwind. Match spacing/sizes to the pixel.

## Login reference (node 47:3798) — pulled, exact values

- Page background: surface default `#fafafa` (bg-background/card token).
- Outer container: absolute in Figma, but in-app it's a centered responsive layout. Content row: `flex gap-24px items-center`, width 1280px (max), left/top offsets are Figma canvas coords — in-app center it.
- **Image column:** 628×748, `rounded-[24px]`, object-cover image (the auth hero `image 4`). Asset URL in get_design_context output (expires in 7 days — download with curl -L into public/ and reference locally; e.g. public/auth/hero.png). Logo SVG asset (89:4902) also provided — but prefer the existing LogoMark component from src/components/icons/brand.
- **Auth form card:** bg `#f4f4f5`, border 1px `#a1a1aa`, radius 24px, padding x/y 24px, `flex flex-col items-center gap-48px` (sections gap). Flex-1, min-w-0.
  - **Logo** at top: 140×144.
  - **Heading block:** `flex flex-col gap-12px items-center text-center`.
    - Title: Paragraph lg Semibold (20/32, weight 600), color `#18181b`. ("قم بتسجيل الدخول إلى حسابك")
    - Subtitle: Paragraph xsm Regular (14/20), color body `#52525a`. ("أدخل بيانات اعتمادك للوصول إلى حسابك")
  - **Fields block:** `flex flex-col gap-24px w-full` (sub-sections gap). Each Input Field: `flex flex-col gap-12px items-end w-[578px]`.
    - Label row: Paragraph sm Medium (16/24), label text `#18181b`, with a red `*` required marker (`#ef4444`). RTL: text-right / items-end.
    - Input (use the Input ATOM, md size): bg `#f4f4f5`, border `#e4e4e7`, radius 8px (sm), px 8 / py 12, placeholder `#a1a1aa` Paragraph xsm. Email field has a trailing Email icon; Password field has a leading Eye toggle (use the PasswordToggle molecule) + trailing Password icon + placeholder.
    - "هل نسيت كلمة السر ؟" link: Paragraph xsm Medium underlined, color secondary `#14b8a6`, text-right, full width.
  - **Submit Button** (use Button ATOM, primary, md): full width, bg `#123458`, border `#102f50`, radius 12px, py 12, label Paragraph xsm Medium `#fafafa`. ("تسجيل الدخول")
  - **Footer line:** centered Paragraph xsm Medium: "ليس لديك حساب؟ " in `#18181b` + "سجل الآن" as a secondary `#14b8a6` underlined link to register.

## New tokens to ADD (additive, in globals.css + @theme inline) — "Card Authentication"

These are auth-card-specific and not yet in the system:

- `--card-auth-surface` = `#f4f4f5`
- `--card-auth-border` = `#a1a1aa`
- `--card-auth-radius` = 24px (reuse --radius-card-xl if equal)
- Auth card padding 24, section gap 48px, sub-section gap 24px, heading gap 12px (use spacing utilities p-6, gap-12, gap-6, gap-3).
  Do NOT change existing tokens.

## Sign Up screens (89:4922 General + per-flow) — fetch each via get_design_context

- Same split layout + auth card. Sign Up 1 = role/identity fields; Sign Up 2 = continued fields. Multi-step. General flow has a role selection (Student/Parent/Teacher) — reuse SelectableCard / RadioGroup. Student/Parent/Instructor flows are variants with flow-specific fields. Build the general flow first, then the role-specific variants share the step shell.
- Social sign-in buttons (Google/Facebook/Apple) appear in sign-up — use the brand icons from src/components/icons/brand.

## Project integration constraints (CRITICAL — preserve existing behavior)

- The form LOGIC already exists and MUST be reused, not rewritten: src/features/auth (schemas.ts zod, hooks.ts, api.ts, components/login-form.tsx, components/register-form.tsx, index.ts). Keep react-hook-form + zod validation, the existing field names, submit handlers, and i18n keys working.
- Pages live at src/app/[locale]/(auth)/{login,register,forgot-password}/page.tsx with shared layout src/app/[locale]/(auth)/layout.tsx. Rework the layout + pages to the Figma split-screen auth design. The current layout is a simple centered card — replace with the Figma image-column + auth-card shell (responsive: on mobile, stack / hide image column gracefully).
- ALL copy via next-intl (namespace `auth`), Arabic + English in sync (messages/ar.json + en.json). The Arabic strings above are the Figma copy — map them to/update the `auth` namespace keys; keep English translations sensible.
- RTL is default (Arabic). Everything uses logical properties (ps/pe/ms/me/start/end), never left/right. Works light + dark.
- Reuse design-system components: Input, Button, Label, Checkbox, PasswordToggle, SelectableCard, brand icons, LogoMark. Do NOT re-style atoms inline; compose them. If an atom needs the exact Figma look and already matches (it should, since atoms were built from these same tokens), just use it.
- Assets: download Figma image assets (auth hero per flow) with curl -L into public/auth/ and reference via next/image. Never use the temporary figma asset URLs at runtime.

## Pixel-perfect verification

- After building, use the figma power get_screenshot on each implemented node id to compare against the built screen; iterate until it matches (sizes, spacing, colors, radii, typography) with no visible 1px drift.
- Standard gates (repo root, all must pass): `npm run typegen` then `npm run typecheck`, `npm run lint` (0 errors), `npm run test` (keep green), `npm run build`. Fix every failure.
