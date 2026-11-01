"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { GlobeIcon } from "lucide-react";

import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/config/locales";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Switches the active locale while keeping the user on the same page.
 * `usePathname` returns the locale-agnostic path, and `router.replace` with a
 * `locale` option re-renders that path under the new locale.
 */
export function LocaleSwitcher() {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelect(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;
    startTransition(() => {
      // Pass through dynamic params so parameterized routes resolve correctly.
      router.replace(
        // @ts-expect-error -- params shape is route-dependent at runtime
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("switchLanguage")}
          disabled={isPending}
        >
          <GlobeIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => onSelect(locale)}
            className={locale === activeLocale ? "font-semibold" : undefined}
          >
            {localeLabels[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
