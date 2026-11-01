import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { locales, type Locale } from "@/config/locales";
import { routes } from "@/config/routes";

/**
 * Sitemap generator for the public, indexable pages.
 *
 * Each entry carries hreflang `alternates` so search engines understand the
 * ar/en variants of every URL. Dynamic content (individual courses, teacher
 * profiles) can be appended here later from the API. Static for now — cached
 * by default under Cache Components.
 */

/** Locale-agnostic public paths worth indexing, with crawl hints. */
const publicPaths: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: routes.home, changeFrequency: "weekly", priority: 1 },
  { path: routes.courses, changeFrequency: "daily", priority: 0.9 },
  { path: routes.teachers, changeFrequency: "weekly", priority: 0.8 },
  { path: routes.about, changeFrequency: "monthly", priority: 0.5 },
  { path: routes.contact, changeFrequency: "monthly", priority: 0.5 },
];

function url(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path;
  return `${siteConfig.url}/${locale}${clean}`;
}

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = url(path, locale);
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Emit one entry per (locale, path) with cross-locale hreflang alternates.
  return locales.flatMap((locale) =>
    publicPaths.map(({ path, changeFrequency, priority }) => ({
      url: url(path, locale),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
