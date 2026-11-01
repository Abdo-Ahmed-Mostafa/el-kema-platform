import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

/** Dashboards are private — keep them out of search indexes. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function StudentLayout({
  children,
  params,
}: LayoutProps<"/[locale]/student">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardShell role="student">{children}</DashboardShell>;
}
