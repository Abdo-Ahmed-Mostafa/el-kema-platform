import { getTranslations } from "next-intl/server";

/**
 * Accessibility skip link. Visually hidden until focused, it lets keyboard and
 * screen-reader users jump straight to the main content, past the navigation.
 * Targets the element with `id="main-content"`.
 */
export async function SkipToContent() {
  const t = await getTranslations("common");

  return (
    <a
      href="#main-content"
      className="bg-background text-foreground focus:ring-ring sr-only z-50 rounded-md px-4 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:ring-2"
    >
      {t("skipToContent")}
    </a>
  );
}
