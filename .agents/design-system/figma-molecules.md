# Figma Molecules Inventory — El-Kema (stage 4A)

Source: Figma file `y0eOLyKLtTHnJYzOW046WR`, "Design System" page. Build on stage-1 tokens and the stage-2/3 atoms + icons. Reuse existing CSS variables/Tailwind utilities; do NOT redefine tokens.

Shared token additions observed (map to existing vars, add only if genuinely missing):

- Body text color: `#52525a` (muted-ish foreground; if not already present as a token, map to muted-foreground or add `--text-body`).
- Paragraph lg: size 20 / line-height 32 (medium weight) — for section/card headings.
- Card: radius medium 16px, padding x/y large 24px, border subtle `#e4e4e7`, surface `#fafafa` (card token), section gap 24.

## Components in scope for stage 4A (molecules)

### Selectable Cards (Figma 420:3498) — states Default / Hover / Pressed(selected) / Disabled

- radius 8, padding x16 y8, stroke 1, heading↔subheading gap 8, text↔icon gap 8.
- Default: icon/heading/subheading `#a1a1aa`, bg `#f4f4f5`, border `#a1a1aa`.
- Hover: icon/heading/subheading `#123458`, bg `#eff5fa`, border `#123458`.
- Pressed/selected: same text/icon `#123458`, bg `#fafafa`, border `#123458`.
- Heading paragraph-sm medium; subheading paragraph-xsm regular. Has leading icon slot. Selectable (controllable `selected`/value), keyboard operable, a11y as radio/checkbox-card.

### Pagination (Figma 1160:22642 + Next/Previous 1160:22650)

- Page item: 40x40, radius full (999), paragraph-xxsm medium. Default text `#123458` surface `#fafafa`; Selected surface primary `#123458` text inverse `#fafafa`, border `#102f50`.
- Next/Previous controls (242x36) with left/right arrow icons — RTL aware (previous = inline-start).

### FAQ Accordion (Figma 656:7297) — states Default / Hover / Answer(expanded)

- Row ~1280 wide, radius full? No — uses card radius; question paragraph-lg medium, body paragraph-xsm regular `#52525a`.
- Default surface `#fafafa`, border subtle `#e4e4e7`; Hover tint; Answer expands to show body. Chevron icon rotates. Primary accents `#123458`.
- Use an accessible accordion pattern (button header controls aria-expanded, region for panel). Consider @radix-ui/react-accordion ONLY if willing to add it pinned-exact & React19-compatible; otherwise build accessible native. Prefer native to avoid a new dep unless it meaningfully improves a11y.

### Nav Bar (Figma section 451:1352) — PULL STRUCTURE FROM FIGMA via get_design_context (node 451:1352 and children)

- Contains: nav label items (states Default/Hover/Pressed/Disabled), a Search molecule (see below), and the top Nav Bar row (1440 wide, "Closed, Type=FTU"). Reconcile with existing src/components/shared/navbar.tsx — update it to match Figma while keeping its API, i18n, locale-switcher, theme-toggle, and logo usage intact. Grep call sites.

### Search (Figma 451:1288, inside Nav Bar) — states: Search Default/Hover (icon button 48px), Search Bar Default/Hover, sizes Large/Small

- Search bar: rounded input with leading search icon; Large (233x50) and Small (233x42). Hover adds primary border/bg tint. Reuse the Input atom styling where possible.

### Button Group (Figma 129:740) — states Default/Hover/Pressed

- Vertical/horizontal grouped buttons (30x36 each). Segmented control style. Reuse Button atom tokens.

### Dropdown Labeled (Figma 281:1946)

- A labeled dropdown = Label atom + Select atom composed (285x82). Just compose existing Label + Select; match spacing (gap 8).

### Show and Hide (password toggle) (Figma 329:2363) — State Eye / Eye Closed

- 100px icon; use the existing icons (Eye / EyeOff from lucide) as a password-visibility toggle button; a11y (aria-pressed, aria-label i18n). Likely a small molecule used inside password Input.

### Progress Ring (Figma 640:4725) — State=1 / State=2 (205x205)

- Circular progress indicator (SVG ring). Primary stroke `#123458` on subtle track; shows percentage in center (paragraph-lg). Two visual states (e.g. different values/colors). Accessible (role=progressbar, aria-valuenow/min/max). PULL exact ring geometry/colors from Figma get_design_context (node 640:4725) if needed.

## Requirements (all molecules)

- Compose from existing atoms/icons wherever possible; do not duplicate atom styling.
- TypeScript, `cn`, cva for variants, forwardRef where idiomatic, full a11y (roles, aria, keyboard, focus-visible ring token), RTL + LTR using logical properties (ps/pe/start/end, never left/right), light + dark.
- i18n: any user-facing strings go through next-intl (follow existing navbar/footer patterns); do not hardcode Arabic/English.
- Place molecules under src/components/ui/ (or a src/components/molecules/ folder if that fits the project better — check existing structure first and be consistent) and barrel-export.
- For structural fidelity of Nav Bar / Search / Progress Ring, use the figma power get_design_context on the listed node ids (fileKey y0eOLyKLtTHnJYzOW046WR) to get exact layout, then adapt to the project (do not paste raw Figma code — adapt to tokens/atoms).
- Do NOT adopt into real app pages yet beyond reconciling the existing navbar/logo; full page adoption is a later stage.

## Verification

From repo root (all must pass): `npm run typecheck`, `npm run lint` (0 errors), `npm run test`, `npm run build`. Fix every failure. Done only at zero errors.
