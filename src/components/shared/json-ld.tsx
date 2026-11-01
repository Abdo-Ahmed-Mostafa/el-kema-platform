/**
 * Renders a JSON-LD structured-data script tag.
 *
 * Server Component — the script is part of the prerendered HTML so crawlers
 * see it immediately. The data must be a serializable plain object produced by
 * the builders in `@/lib/seo/json-ld`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static/server-built; safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
