import { setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/shared/logo";

/**
 * Auth shell: a centered, minimal layout for login / register / password
 * flows. No site chrome — just the brand and the form card.
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
      className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12"
    >
      <Logo />
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
