"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type NavLink = {
  href: string;
  label: string;
};

type NavLinksProps = {
  links: NavLink[];
  className?: string;
};

/**
 * Desktop nav links with an active-route indicator.
 *
 * Client Component: it reads the locale-agnostic pathname and marks the
 * matching link with `aria-current="page"` so the Figma Pressed state
 * (`aria-[current=page]:text-primary-pressed`) actually renders. The home
 * link matches exactly; the rest match on prefix so nested routes
 * (e.g. /courses/slug) keep the parent highlighted.
 */
export function NavLinks({ links, className }: NavLinksProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className={cn("hidden items-center gap-6 md:flex", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          // Figma label states Default/Hover/Pressed — paragraph-md 18/28
          // medium (arbitrary; tokens unchanged). aria-current → pressed.
          className="text-[18px] leading-7 font-medium text-muted-foreground transition-colors hover:text-primary aria-[current=page]:text-primary-pressed"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
