# Home carousels — El-Kema (fix section 1 to 3 cards + swiper)

Figma file `y0eOLyKLtTHnJYzOW046WR`, Home frame `624:3480`. Verified from metadata:

- **Section 1 "تابع تقدّمك في رحلتك التعليمية"** (frame 624:3497): THREE `Student Tracking Progress Card` instances (696:8132 / 650:5511 / 629:3952), each 628px wide. 3×628 + gaps > 1280 container ⇒ this is a horizontal CAROUSEL/swiper, not a 2-card grid. The current code renders 2 cards — WRONG. Make it THREE cards in a swiper.
- **Section 2 "اكتشف الدورات التي تناسبك"** (624:3505): three Course Cards (410px each) + a "التالي" Button (653:6635) below.
- **Section 3 "تعلّم على يد نخبة من المدرّسين"** (656:6926): three Instructor Cards (410px) + a "التالي" Button (656:6930) below.

## What to build

A reusable, dependency-free **Carousel** (client component) using CSS scroll-snap + prev/next buttons (and the existing "التالي" button where Figma shows it). Requirements:

- Horizontal scroll row, `scroll-snap-type: x mandatory`, each item `scroll-snap-align: start`, smooth scrolling, hidden/!thin scrollbar. Swipe/drag works natively on touch + trackpad; prev/next buttons scroll by one item (use scrollBy with the item width + gap). Keyboard accessible (buttons are real <button>s with aria-labels; the scroll region is focusable with role/aria as appropriate). RTL-correct: in Arabic the row flows right→left and "next" moves toward the start (left) — use logical scrolling (scrollBy with direction derived from `dir`/`document.dir`), never hardcode left/right. prefers-reduced-motion: use `behavior:auto` instead of smooth.
- Disable/hide prev at the start and next at the end (track scroll position).

## Apply it

1. Section 1 (tracking): restore to THREE ProgressTrackingCard items (navy / teal / navy — confirm the 3rd card's surface + copy from Figma via get_design_context on 629:3952; add a third card entry + i18n keys in ar/en in sync) inside the Carousel at their Figma 628px width. Keep the spinner + hidden static arc behavior already committed.
2. Sections 2 & 3 (courses, instructors): put the three cards in the same Carousel; wire the Figma "التالي" button as the next control (and add a prev control for symmetry/a11y). Keep the existing "اكتشف أكثر" view-all CTAs.

- Thin section wrappers stay server components; the Carousel is a client child they compose (pass the pre-rendered cards as children so data stays server-rendered).

## Constraints

- No new dependencies (CSS scroll-snap only). TypeScript, cn, logical properties only (never left/right), light + dark, existing tokens. Keep ar/en parity (messages-parity green) for any new keys (e.g. third tracking card, carousel aria labels "التالي/السابق"). Do NOT change tokens/font. Reuse existing card organisms unchanged.
- Add a unit test for the Carousel (renders items, buttons present, next disabled logic) and update the tracking-section test if it asserted 2 cards.

## Verification (repo root, pnpm, all must pass)

`pnpm run typegen` then `pnpm run typecheck`, `pnpm run lint` (0 errors), `pnpm run test` (keep green), `pnpm run build`. Then COMMIT to main (this one is approved to commit).
