import { getTranslations } from "next-intl/server";

import { SearchBar } from "@/components/molecules/search";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { UserMenu } from "./user-menu";

/**
 * Dashboard header (Figma Dashboard Header 955:4905): a greeting block, an
 * optional search field, the locale + theme controls and the user menu
 * (which carries the avatar). Server Component composing the client controls
 * (SearchBar / LocaleSwitcher / ThemeToggle / UserMenu stay client).
 */
export async function DashboardTopbar() {
  const t = await getTranslations("dashboard");

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 flex-col">
        <span className="text-paragraph-md truncate">{t("greeting")}</span>
        <span className="text-muted-foreground truncate text-xs">
          {t("greetingSubtitle")}
        </span>
      </div>
      <div className="ms-auto hidden md:block">
        <SearchBar size="sm" className="w-56" />
      </div>
      <div className="flex items-center gap-1">
        <LocaleSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
