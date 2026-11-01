import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";

/**
 * The current year for the copyright line.
 *
 * `'use cache'` marks this as cacheable so the `Date.now()` read is treated as
 * a stable, cached value rather than request/prerender-time data — which is
 * required under Cache Components (otherwise the unstable value throws during
 * prerender). A year is fine to cache; it revalidates well within its drift.
 */
async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

/**
 * Public site footer. Server Component; reads translations on the server.
 */
export async function Footer() {
  const t = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const year = await getCurrentYear();

  const links = [
    { href: routes.courses, label: t("courses") },
    { href: routes.teachers, label: t("teachers") },
    { href: routes.about, label: t("about") },
    { href: routes.contact, label: t("contact") },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <Logo />
            <p className="text-muted-foreground text-sm">
              {siteConfig.description}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="text-muted-foreground mt-8 border-t pt-6 text-center text-xs">
          © {year} {siteConfig.name}. {tf("rights")}
        </div>
      </div>
    </footer>
  );
}
