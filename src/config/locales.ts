/**
 * Internationalization configuration — single source of truth for locales.
 * Consumed by the i18n routing, the proxy (locale redirect), and layouts
 * (to set `lang` and `dir`).
 */

export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

/** Text direction per locale. Drives `dir` on <html> and RTL-aware styles. */
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

/** Human-readable labels, e.g. for a language switcher. */
export const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

/** Narrow an arbitrary string to a supported Locale. */
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Resolve the text direction for a locale, defaulting to LTR. */
export function getDirection(locale: string): "rtl" | "ltr" {
  return isLocale(locale) ? localeDirection[locale] : "ltr";
}
