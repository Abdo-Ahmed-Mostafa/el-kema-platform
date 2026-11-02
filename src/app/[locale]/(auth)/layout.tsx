import Image from "next/image";
import { setRequestLocale } from "next-intl/server";

import { getDirection } from "@/config/locales";

/**
 * Auth shell (Figma split-screen): a centered row pairing a decorative hero
 * image column with the auth card. The image column is hidden below `lg`
 * and the card goes full-width on mobile. Stays a Server Component — no
 * client JS. Matches the Figma auth frames (1280px row, 628px-wide image,
 * 24px radius, 48px section gap inside the card).
 *
 * The row uses `items-stretch` and the image column `self-stretch` (no fixed
 * height) so the hero always matches the card's height on every screen —
 * Login's card is short, Sign Up's is tall, and in Figma the image and card
 * are always the same height. A fixed image height would otherwise leave the
 * image shorter than the taller register card.
 *
 * The row wrapper is forced to `dir="ltr"` so the hero column stays on the
 * LEFT and the card on the RIGHT in every locale — matching all three Figma
 * nodes (47:3798, 89:4922, 221:1217). A plain flex row would otherwise
 * reverse under the document's RTL direction (Arabic is the default locale)
 * and mirror the whole composition. The card column restores the locale
 * direction so its internals (text, fields, icons) stay RTL for Arabic.
 */
export default async function AuthLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center px-4 py-12"
    >
      <div dir="ltr" className="flex w-full max-w-[1280px] items-stretch gap-6">
        <div className="relative hidden w-[628px] shrink-0 self-stretch overflow-hidden rounded-card-xl lg:block">
          <Image
            src="/auth/hero.png"
            alt=""
            fill
            priority
            sizes="628px"
            className="object-cover"
          />
        </div>
        <div
          dir={getDirection(locale)}
          className="flex min-w-0 flex-1 flex-col items-center gap-12 rounded-card-xl border border-card-auth-border bg-card-auth-surface p-6"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
