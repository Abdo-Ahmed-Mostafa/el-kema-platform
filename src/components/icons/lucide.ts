/**
 * Lucide-backed icon set — El-Kema Figma "Icons" frame.
 *
 * Every monochrome UI glyph in the Figma design maps to a lucide-react icon.
 * We re-export each under a semantic, Figma-aligned PascalCase name so call
 * sites reference the design vocabulary ("GraduationIcon") rather than the
 * raw lucide name ("GraduationCap").
 *
 * Why direct named re-exports (not a runtime `{ [name]: Icon }` map):
 * named re-exports stay tree-shakeable — a page that imports `SearchIcon`
 * pulls in only `Search`, never the whole set.
 *
 * All of these are `LucideIcon`s: they render an SVG that inherits color via
 * `currentColor` and accept `className`, `size` (default 24), `aria-hidden`,
 * and `aria-label`. See `figma-icons.md` for the full mapping (source of truth).
 *
 * Duplicate Figma names (several "Rate", "Add", "Home", "Checkmark", etc.)
 * are resolved to a single canonical export each — no conflicting duplicates.
 */

export {
  // --- Informational / feedback ---
  Info as InfoIcon,
  CircleHelp as QuestionIcon,
  TriangleAlert as WarningIcon,
  Ban as BanIcon,
  ShieldCheck as SecurityIcon,

  // --- Auth / identity ---
  Mail as EmailIcon,
  Lock as PasswordIcon,
  User as PersonIcon,
  Phone as PhoneIcon,
  IdCard as CardIdIcon,

  // --- Roles ---
  Users as ParentIcon,
  UserRound as TeacherIcon,
  GraduationCap as GraduationIcon,
  BookUser as StudentIcon,

  // --- Navigation: chevrons & arrows ---
  ChevronDown as DownArrowIcon,
  ChevronUp as UpArrowIcon,
  ChevronRight as RightArrowIcon,
  ChevronLeft as LeftArrowIcon,
  ArrowDownUp as SortByIcon,

  // --- Actions ---
  Plus as AddIcon,
  UserPlus as AddUserIcon,
  Minus as MinusIcon,
  Search as SearchIcon,
  X as CancelIcon,
  Pencil as EditIcon,
  Trash2 as TrashIcon,
  RefreshCw as SyncIcon,

  // --- Education / content ---
  School as SchoolIcon,
  BookOpen as BookOpenedIcon,
  Book as BookClosedIcon,
  Library as LibraryIcon,
  Files as FilesIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Radio as LiveStreamIcon,
  Sigma as SigmaIcon,

  // --- Data / analytics ---
  BarChart3 as ChartIcon,
  BarChart2 as HistogramIcon,
  LineChart as GrowthChartIcon,
  TrendingUp as TrendingUpIcon,
  Target as TargetIcon,
  Compass as CompassIcon,
  Route as RouteIcon,
  Layers as LayersIcon,
  LayoutDashboard as LayoutDashboardIcon,

  // --- Commerce ---
  ShoppingCart as CartIcon,
  ShoppingBag as BagIcon,
  Tag as SaleIcon,
  Banknote as MoneyIcon,

  // --- Engagement / rewards ---
  Star as RateIcon,
  Medal as MedalIcon,
  BadgeCheck as BadgeCheckIcon,
  Flame as FireIcon,
  Rocket as RocketIcon,
  Sparkles as SparklesIcon,
  Handshake as HandShakeIcon,
  Timer as StopwatchIcon,

  // --- Misc UI ---
  Settings as SettingsIcon,
  Home as HomeIcon,
  Calendar as CalendarIcon,
  MapPin as LocationIcon,
  Check as CheckmarkIcon,

  // Shared type for consumers that type an icon prop.
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
