# Auth polish + navbar — fix spec (El-Kema)

Three fixes. Figma file key `y0eOLyKLtTHnJYzOW046WR`. Design system already built; auth pages integrated. Reuse tokens/atoms; do NOT change the core palette/font.

## FIX 1 — Input icon position + real Figma icons (pixel-perfect)

### Positioning (src/components/ui/input.tsx)

Current: icon span uses `start-0 ps-2` / `end-0 pe-2` and `[&_svg]:size-4` (16px). Figma Input Field spec: placeholder padding x = 8px, **text↔icon gap = 8px**, and the icon is **24px**, vertically centered, on the field's leading edge in the row. In the Figma auth fields (RTL), the icon sits at the START (right) with the placeholder text filling the rest; gap 8.

- Make the icon 24px (not 16px) to match Figma — but note the field height is 46px (md) with py 12, so a 24px icon fits. Consider size-5 (20px) vs size-6 (24px): match Figma = 24px. Verify it doesn't overflow the 46px field.
- Ensure the input's text padding on the icon side reserves icon width + 8px gap + 8px edge padding (so text never overlaps the icon). Currently `ps-9`/`pe-9` (36px) — recompute for a 24px icon: edge 8 + icon 24 + gap 8 = 40px → use ps-10/pe-10, and the icon span offset = edge padding 8 (ps-2 is 8px, OK) but vertically center and give the icon its 24px box.
- Keep startIcon/endIcon API. Keep RTL correct (logical start/end only). Fix both auth usage (endIcon on the start side in RTL) so the icon lands exactly where Figma shows it.

### Real icons — pull from Figma as SVG (replace the lucide approximations)

The auth input icons are custom Figma glyphs, currently mapped to approximate lucide icons (Person→User, Card ID→IdCard). For 1px fidelity, pull the REAL SVGs from Figma and author them as typed React components under src/components/icons/ (monochrome, currentColor, className + size default 24), then point the auth usages at them. Icons needed for auth screens (from the Icons frame 89:4880):

- Person (27... node `107:698`) — person-in-circle, used for the 4 name fields.
- Phone (`107:712`) — used for mobile.
- Card ID (`358:2720`) — used for national id.
- Email (`73:4703`) — used for login email.
- Show/Hide eye (`73:4731` eye / `309:2318` eye-closed) — password toggle.
  Use get_design_context on each node id (fileKey y0eOLyKLtTHnJYzOW046WR) to get the SVG; adapt to a clean React component. Keep the existing semantic export names (PersonIcon, PhoneIcon, CardIdIcon, EmailIcon, and the eye icons used by PasswordToggle) so call sites keep working — just back them with the real Figma SVG instead of lucide. If other screens already rely on the lucide version of these names elsewhere, prefer updating the shared icon so every use gets the accurate glyph; grep call sites first.
- After, use get_screenshot on nodes 47:3798 (login) and 89:4922 (sign up 1) and compare the built pages — icons must match position, size, and shape with no visible drift.

## FIX 2 — Numeric-only input for phone + national id (handle it well)

The register fields phone (رقم الهاتف المحمول) and nationalId (الرقم القومي) currently accept letters; validation only runs on submit. Make them robust:

- Restrict input to digits as the user types (block non-digit keystrokes AND sanitize pasted content), not only on submit. Implement cleanly — e.g. an onChange/onInput that strips non-digits (and for phone, allow a single leading + only if you keep the +20 format; simplest: digits only and let the regex handle prefixes — but then the schema's +20/0020 prefixes can't be typed, so EITHER keep digits-only and simplify the phone rule to a plain Egyptian 11-digit `01xxxxxxxxx`, OR allow a leading +). Pick the cleaner UX: digits-only with maxLength (nationalId=14, phone=11) and an Egyptian 11-digit phone rule. Update the zod phone regex accordingly if you drop the +20 prefix so schema and input agree.
- Set inputMode="numeric" and pattern/maxLength appropriately; keep type="tel" for phone. Keep it accessible and RTL/LTR correct.
- Do this in a reusable way if sensible (e.g. a small numeric-input helper or an Input prop), but do NOT over-engineer — a focused handler on these two fields is fine. Update schemas.test.ts to match any regex change and keep it green.

## FIX 3 — Sticky navbar on all pages EXCEPT auth

- The Navbar currently renders only in src/app/[locale]/(public)/layout.tsx and is NOT sticky.
- Make the Navbar STICKY (sticks to the top of the viewport on scroll) — add `sticky top-0 z-50` (or the project's equivalent) to the navbar wrapper; ensure the sticky bg is solid/opaque enough to sit over scrolling content (it currently uses bg-card/80 + blur — keep or make opaque per the Figma solid #fafafa; acceptable to keep the blur).
- Make the navbar appear on ALL page groups EXCEPT the auth group:
  - (public): already has it — keep, make sticky.
  - (dashboard): the dashboard layouts use DashboardShell/DashboardTopbar — confirm whether the product wants the PUBLIC Navbar here too. The user said "on all pages". Dashboards already have their own DashboardTopbar/sidebar chrome. CLARIFY INTENT in the plan: adding the public Navbar on top of the dashboard topbar would double the chrome. Reasonable interpretation: the public Navbar shows on all NON-auth, NON-dashboard pages (public site), AND dashboards keep their own sticky topbar. If a page group has no chrome today and is non-auth, add the Navbar. Do not stack two navbars on dashboards. Record the decision explicitly.
  - (auth): MUST NOT show the navbar (Figma auth has none). Leave the (auth) layout without a Navbar.
- Verify no auth page renders a navbar after the change.

## Verification

From repo root (all must pass, this project uses pnpm now): `pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Fix every failure. Use get_screenshot to confirm auth pixel-fidelity. Commit to main. Clean up temp asset files (keep only authored icon components; hero images already in public/auth).
