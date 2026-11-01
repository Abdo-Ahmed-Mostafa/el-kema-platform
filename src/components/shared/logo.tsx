import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/icons/brand";
import { cn } from "@/lib/utils/cn";

/**
 * Brand logo / wordmark. Links home and preserves the active locale.
 * Uses the Figma-accurate `LogoMark` symbol (node 89:4902) alongside the
 * site name. Pure Server Component — no client JS needed.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-tight",
        className,
      )}
      aria-label={siteConfig.name}
    >
      <LogoMark size={32} aria-hidden />
      <span className="text-lg">{siteConfig.name}</span>
    </Link>
  );
}
