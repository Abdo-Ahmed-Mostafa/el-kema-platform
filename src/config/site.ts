/**
 * Central site configuration.
 * Used across metadata, SEO, and UI. Keep all site-wide constants here
 * so there are no hardcoded strings scattered through the app.
 */

export const siteConfig = {
  name: "El Kema",
  // Short name used in places with limited space (e.g. PWA, small headers).
  shortName: "El Kema",
  description:
    "El Kema is a modern educational platform connecting students, teachers, and parents with high-quality courses and learning tools.",
  // Public base URL. Read from env in production; falls back for local dev.
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  // Default Open Graph image (relative to `url`). Replace with a real asset.
  ogImage: "/og-image.png",
  // Default locale used when none is detected.
  defaultLocale: "ar",
  // Social / contact links. Fill in real values when available.
  links: {
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
  // Keywords used as a sensible SEO default; pages can override.
  keywords: [
    "El Kema",
    "education",
    "online courses",
    "e-learning",
    "teachers",
    "students",
    "منصة تعليمية",
    "كورسات",
    "تعليم اونلاين",
  ],
  // Contact details surfaced in the footer / contact page.
  contact: {
    email: "info@elkema.com",
    phone: "",
  },
  // Author / organization name for metadata and structured data.
  creator: "El Kema",
} as const;

export type SiteConfig = typeof siteConfig;
