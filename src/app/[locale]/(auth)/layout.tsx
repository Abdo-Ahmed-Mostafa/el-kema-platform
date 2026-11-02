import Image from "next/image";
import { setRequestLocale } from "next-intl/server";

/**
 * Auth shell (Figma split-screen): a centered row pairing a decorative hero
 * image column with the auth card. The image column is hidden below `lg`
 * and the card goes full-width on mobile. Stays a Server Component — no
 * client JS. Matches Figma Login node 47:3798 (1280px row, 628×748 image,
 * 24px radius, 48px section gap inside the card).
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
      <div className="flex w-full max-w-[1280px] items-center gap-6">
        <div className="relative hidden h-[748px] w-[628px] shrink-0 overflow-hidden rounded-card-xl lg:block">
          <Image
            src="/auth/hero.png"
            alt=""
            fill
            priority
            sizes="628px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-12 rounded-card-xl border border-card-auth-border bg-card-auth-surface p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
