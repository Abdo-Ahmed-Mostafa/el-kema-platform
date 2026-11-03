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
import { GraduationIcon } from "@/components/icons";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";

/**
 * Public site top navigation.
 *
 * Server Component: it reads translations on the server and renders links
 * statically. Interactive pieces (theme, locale, mobile sheet) are their own
 * client components composed in here.
 *
 * Layout matches Figma 451:1151 (RTL on screen → logically mirrored):
 *  - inline-START edge: a single primary navy icon Button (login CTA).
 *  - center: the nav links, visually centered regardless of the side zones.
 *  - inline-END edge: the Logo.
 * Surface is solid `bg-card` (#fafafa), ~92px tall, px-6, a bottom border and
 * the shared `shadow-card` token. No search bar. The theme (dark/light) and
 * locale (ar/en) controls sit in the inline-END zone next to the logo on
 * desktop, and also inside the mobile sheet for small screens.
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
    <header className="bg-card shadow-card sticky top-0 z-50 w-full border-b border-border">
      <div className="mx-auto flex min-h-[92px] max-w-7xl items-center justify-between gap-4 px-6 py-3">
        {/* inline-START edge — primary navy icon button (login CTA). */}
        <Button
          asChild
          size="icon"
          aria-label={t("login")}
          className="shrink-0"
        >
          <Link href={routes.login}>
            <GraduationIcon aria-hidden />
          </Link>
        </Button>

        {/* center — nav links, centered in a flexible middle zone so the
            side zones don't shift them off-center (mirrors in RTL/LTR for
            free). Active-route marking lives in a client child so Navbar
            stays a Server Component. */}
        <NavLinks links={links} className="flex-1 justify-center" />

        {/* inline-END edge — theme + locale controls and the brand logo. */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Desktop theme (dark/light) + locale (ar/en) controls. */}
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>

          <Logo className="hidden md:inline-flex" />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                appearance="ghost"
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
                <div className="flex items-center justify-between gap-2">
                  <LocaleSwitcher />
                  <ThemeToggle />
                </div>
                <Button asChild appearance="outline">
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
