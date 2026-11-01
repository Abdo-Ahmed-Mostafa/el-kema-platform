import { siteConfig } from "@/config/site";

/**
 * Minimal JSON-LD builders for schema.org structured data.
 * Each returns a plain object suitable for embedding via the `<JsonLd>`
 * component. Keeping these typed-but-simple avoids a heavy schema dependency
 * while still producing valid structured data for rich results.
 */

type JsonLdObject = Record<string, unknown>;

/** Organization markup for the site (use once, typically in the root). */
export function organizationJsonLd(): JsonLdObject {
  const sameAs = Object.values(siteConfig.links).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
    description: siteConfig.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export interface CourseJsonLdInput {
  name: string;
  description: string;
  url: string;
  providerName?: string;
  instructorName?: string;
  image?: string;
}

/** Course markup for a course detail page. */
export function courseJsonLd(input: CourseJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    provider: {
      "@type": "Organization",
      name: input.providerName ?? siteConfig.name,
      sameAs: siteConfig.url,
    },
    ...(input.instructorName
      ? {
          instructor: {
            "@type": "Person",
            name: input.instructorName,
          },
        }
      : {}),
  };
}

export interface PersonJsonLdInput {
  name: string;
  url: string;
  jobTitle?: string;
  description?: string;
  image?: string;
}

/** Person markup for a public teacher / student profile page. */
export function personJsonLd(input: PersonJsonLdInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList markup from an ordered list of crumbs. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
