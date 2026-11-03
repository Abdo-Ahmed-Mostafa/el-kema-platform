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
          // Figma Nav Bar/Label (451:1034), states Default/Hover/Pressed:
          // paragraph-md 18/28 medium (arbitrary; tokens unchanged).
          // - Default: muted label, transparent 2px bottom border (reserves
          //   space so hover/active never shift layout).
          // - Hover: teal (#14b8a6 = secondary) label + 2px teal bottom border.
          // - Pressed/active (aria-current): navy (#123458 = primary) label +
          //   2px navy bottom border.
          className="border-b-2 border-transparent pb-1 text-[18px] leading-7 font-medium text-muted-foreground transition-colors hover:border-secondary hover:text-secondary aria-[current=page]:border-primary aria-[current=page]:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
