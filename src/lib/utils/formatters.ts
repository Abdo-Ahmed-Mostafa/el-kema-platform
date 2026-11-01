/**
 * Locale-aware formatting helpers (dates, numbers, currency).
 * Built on the Intl API so they work for both Arabic and English.
 */

import type { Locale } from "@/config/locales";

/** Map our app locale to a BCP 47 locale tag for Intl. */
const intlLocale: Record<Locale, string> = {
  ar: "ar-EG",
  en: "en-US",
};

function resolveIntlLocale(locale: Locale): string {
  return intlLocale[locale] ?? "en-US";
}

/** Format a date into a readable string, e.g. "1 January 2026". */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), options).format(
    value,
  );
}

/** Format a number with locale-aware grouping, e.g. "1,234" or "١٬٢٣٤". */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale), options).format(
    value,
  );
}

/** Format a monetary value with currency symbol. Defaults to EGP. */
export function formatCurrency(
  value: number,
  locale: Locale,
  currency = "EGP",
): string {
  return new Intl.NumberFormat(resolveIntlLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}

/** Format a relative time, e.g. "3 days ago" / "منذ ٣ أيام". */
export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale,
): string {
  const value = date instanceof Date ? date : new Date(date);
  const diffSeconds = Math.round((value.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(resolveIntlLocale(locale), {
    numeric: "auto",
  });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = diffSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "year");
}

/** Truncate text to a max length, appending an ellipsis if needed. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
