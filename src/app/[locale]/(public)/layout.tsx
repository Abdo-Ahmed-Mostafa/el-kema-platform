import { setRequestLocale } from "next-intl/server";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationJsonLd } from "@/lib/seo";

/**
 * Public site shell: top navigation + footer around the page content.
 * Applies to the landing page, courses, teacher/student profiles, etc.
 *
 * `setRequestLocale` is called here (before the Navbar reads translations) so
 * next-intl resolves the locale from the static route param rather than from
 * request headers — keeping the shell statically prerenderable under Cache
 * Components.
 */
export default async function PublicLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
