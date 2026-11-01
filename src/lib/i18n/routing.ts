import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/config/locales";

/**
 * Central i18n routing configuration for next-intl.
 * Drives the proxy, the navigation APIs, and request config.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix the locale in the URL (/ar/..., /en/...) for clear,
  // SEO-friendly, per-language URLs.
  localePrefix: "always",
});
