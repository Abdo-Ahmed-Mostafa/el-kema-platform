import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { protectedPrefixes, authPaths } from "@/config/routes";
import { locales } from "@/config/locales";

/**
 * robots.txt generator.
 *
 * Allows everything except the private, non-indexable areas (dashboards and
 * auth pages), disallowed across every locale prefix. Points crawlers at the
 * sitemap. Static — no request-time APIs — so it's cached by default.
 */
export default function robots(): MetadataRoute.Robots {
  // Build locale-prefixed disallow patterns, e.g. "/ar/student", "/en/login".
  const privatePaths = [...protectedPrefixes, ...authPaths];
  const disallow = locales.flatMap((locale) =>
    privatePaths.map((path) => `/${locale}${path}`),
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
