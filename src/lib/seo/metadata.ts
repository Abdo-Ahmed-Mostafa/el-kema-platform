import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { locales, type Locale } from "@/config/locales";

/**
 * Build a localized URL for a locale-agnostic path.
 * @example localeUrl("/courses", "ar") -> "https://site/ar/courses"
 */
function localeUrl(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}/${locale}${clean}`;
}

/**
 * The `alternates.languages` map for a given path: one entry per locale plus
 * an `x-default` pointing at the default locale. Drives hreflang tags.
 */
function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = localeUrl(path, locale);
  }
  languages["x-default"] = localeUrl(path, siteConfig.defaultLocale as Locale);
  return languages;
}

export interface BuildMetadataOptions {
  /** Active locale for this page. */
  locale: Locale;
  /** Locale-agnostic path, e.g. "/courses" or "/courses/intro-to-chem". */
  path: string;
  /** Page title (without the site-name template suffix). */
  title?: string;
  /** Page description; falls back to the site description. */
  description?: string;
  /** Optional OG image path/URL; falls back to the site OG image. */
  image?: string;
  /** Mark the page as non-indexable (e.g. dashboards). */
  noIndex?: boolean;
  /** Extra keywords merged with the site defaults. */
  keywords?: string[];
}

/**
 * Central SEO metadata builder.
 *
 * Produces a complete `Metadata` object with a canonical URL, hreflang
 * alternates for every locale, and Open Graph / Twitter cards — so every page
 * gets consistent, correct SEO by calling one helper.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex = false,
  keywords,
}: BuildMetadataOptions): Metadata {
  const resolvedDescription = description ?? siteConfig.description;
  const canonical = localeUrl(path, locale);

  return {
    title,
    description: resolvedDescription,
    keywords: keywords
      ? [...siteConfig.keywords, ...keywords]
      : [...siteConfig.keywords],
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: title ?? siteConfig.name,
      description: resolvedDescription,
      url: canonical,
      locale,
      // When no explicit image is given, omit it so Next's generated
      // `opengraph-image` file convention supplies the default automatically.
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.name,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}
