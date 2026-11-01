import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/lib/i18n/routing";
import { getDirection } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { Providers } from "@/providers";
import { SkipToContent } from "@/components/shared/skip-to-content";

import "../globals.css";

/**
 * Arabic-first UI font (IBM Plex Sans Arabic). Loaded once at the root and
 * exposed as a CSS variable so Tailwind can pick it up as the default sans
 * family.
 */
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Pre-render every supported locale at build time. Because this lives on
 * the root layout, `locale` becomes a root param readable via
 * `next/root-params` anywhere on the server.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  // Reject unknown locales before doing any work.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opt into static rendering for this locale (required with next-intl
  // when pages are statically generated / cached).
  setRequestLocale(locale);

  // Pass locale + messages explicitly so the client provider doesn't do a
  // request-time lookup (reading headers), which would block static
  // prerendering under Cache Components.
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${ibmPlexSansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipToContent />
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
