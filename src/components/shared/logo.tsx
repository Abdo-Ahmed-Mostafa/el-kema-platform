import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Brand logo / wordmark. Links home and preserves the active locale.
 * Pure Server Component — no client JS needed.
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
      <span
        aria-hidden
        className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-black"
      >
        EK
      </span>
      <span className="text-lg">{siteConfig.name}</span>
    </Link>
  );
}
