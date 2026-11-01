import { getTranslations } from "next-intl/server";
import { MenuIcon } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";

/**
 * Public site top navigation.
 *
 * Server Component: it reads translations on the server and renders links
 * statically. Interactive pieces (theme, locale, mobile sheet) are their own
 * client components composed in here.
 */
export async function Navbar() {
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");

  const links = [
    { href: routes.courses, label: t("courses") },
    { href: routes.teachers, label: t("teachers") },
    { href: routes.about, label: t("about") },
    { href: routes.contact, label: t("contact") },
  ];

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href={routes.login}>{t("login")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={routes.register}>{t("register")}</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={tc("openMenu")}
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="end" className="w-72">
              <SheetHeader>
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Button asChild variant="outline">
                  <Link href={routes.login}>{t("login")}</Link>
                </Button>
                <Button asChild>
                  <Link href={routes.register}>{t("register")}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
