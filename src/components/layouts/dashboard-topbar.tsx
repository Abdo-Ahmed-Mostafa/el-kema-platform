import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { UserMenu } from "./user-menu";

/**
 * Dashboard top bar: locale + theme controls and the user menu.
 * Server Component composing client controls.
 */
export function DashboardTopbar() {
  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-16 items-center justify-end gap-1 border-b px-4 backdrop-blur-sm sm:px-6">
      <LocaleSwitcher />
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
