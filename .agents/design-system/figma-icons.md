# Figma Icons Inventory — El-Kema

Source: Figma file `y0eOLyKLtTHnJYzOW046WR`, frame "Icons" (id 89:4880). All icons are 100x100 symbols on a single row.

Each entry: Figma name → Figma node id. Icons are rendered at 24px by default (scale down the 100px canvas). The default stroke/fill color must be `currentColor` so they inherit text color and work in light/dark.

## Lucide-mappable icons (use lucide-react, which is already a dependency)

Map each Figma name to the closest lucide icon. These are standard UI glyphs:

- Info (27:466) → Info
- Email (73:4703) → Mail
- Password (73:4706) → Lock / KeyRound
- Person (107:698) → User
- Phone (107:712) → Phone
- Graduation (254:1812) → GraduationCap
- Down Arrow (281:1879) → ChevronDown
- Up Arrow (281:1919) → ChevronUp
- Card ID (358:2720) → IdCard / CreditCard
- Add (368:2892), Add (1112:17883), Add User (999:7487) → Plus / UserPlus
- MInus (368:2908), Minus (1114:17971) → Minus
- Search (451:1222) → Search
- Cancel (451:1225), Cancel Red (1142:21788) → X
- Student (420:3545), Student Bold (533:2607) → GraduationCap / BookUser
- Parent (420:3550) → Users
- Teacher (420:3553) → Presentation / UserRound
- Chart (458:2240) → BarChart3
- Compass (458:2247) → Compass
- Book Opened (468:2527), Openbook (533:2560) → BookOpen
- Book Closed (533:2626), Book (952:4810) → Book
- Trending Up (472:2537), Trending Up (739:3339) → TrendingUp
- Histogram (472:2587) → BarChart2
- Target (472:2593) → Target
- Hand Shake (472:2596) → Handshake
- Stopwatch (503:1353, 533:2704, 533:2523) → Timer / Clock
- School (503:1420) → School
- Sale (515:2177) → Tag / BadgePercent
- Fire (515:2185) → Flame
- Rate (544:2983, 711:9295, 1089:15939, 1089:15954) → Star
- 3 Layers (569:3645) → Layers
- Route (569:3650) → Route
- Growth Chart (965:5450) → LineChart / TrendingUp
- Library (569:3767), Library Books (656:6775) → Library
- Cart (999:7497) → ShoppingCart
- Question (872:7156) → CircleHelp
- Medal (898:9973) → Medal
- Ban (1003:7582 is Warning; 1003:7593 is Ban) → Ban
- Warning (1003:7582) → TriangleAlert
- Security (613:2685) → ShieldCheck
- Calendar (1011:8256) → Calendar
- Settings (952:4721), Settings 2 (739:3328) → Settings
- Home (952:4712, 952:4708) → Home
- Money (957:4987) → Banknote / Wallet
- Bag (656:6781) → Briefcase / ShoppingBag
- Sort By (1127:20237) → ArrowDownUp
- Live Stream (617:2874) → Radio / Video
- Files (952:4777) → Files
- Video (1104:17029, 915:3361) → Video
- Sigma (650:5499) → Sigma
- Rocket (739:3333) → Rocket
- Sparkles (687:8111) → Sparkles
- Badge Check (739:3343, 739:3295) → BadgeCheck
- Edit (1174:24796) → Pencil / SquarePen
- Trash (1160:22453) → Trash2
- Layout Dashboard (739:3288, 739:3307) → LayoutDashboard
- Location (1173:24757) → MapPin
- Image (1110:17746) → Image
- Checkmark (803:4080, 803:4494), Check (915:3368) → Check / CheckCheck
- Sync (915:3364) → RefreshCw
- Users (739:3322) → Users
- Right Arrow (653:6657) → ChevronRight / ArrowRight
- Left Arrow (808:4733, 808:4737) → ChevronLeft / ArrowLeft

## Brand / special icons — PULL REAL SVG FROM FIGMA (not in lucide)

These must be extracted as real SVGs from Figma and authored as React SVG components under src/components/icons/brand/. Use get_design_context on each node id to obtain the SVG/asset, then clean it into a typed React component. Preserve brand colors (these are NOT currentColor — they are multi-color brand marks).

- Google (73:4738)
- Facebook (73:4751)
- Apple (89:4879)
- Vodafone (1032:10378)
- Orange (1032:10393)
- Mastercard (1032:10412)
- Visa (1032:10404)

Also the Logo marks (separate from the Icons frame):

- Logo (89:4902)
- Logo with Text (445:3570)

## Deliverable shape

- A central icon module: src/components/icons/index.ts (or index.tsx) exporting a typed set.
- For lucide-mapped icons, re-export under the Figma-aligned names (keep a consistent naming convention, e.g. PascalCase matching usage) so call sites reference semantic names.
- Brand/payment icons + logos as standalone SVG components accepting className + size, defaulting to 24.
- All icons sized via a shared convention (size prop or className), inherit color via currentColor for monochrome ones.
- An Icon wrapper or registry is optional but keep it tree-shakeable (prefer direct named exports over a giant map that defeats tree-shaking).
