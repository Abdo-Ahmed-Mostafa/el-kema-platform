import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

/** Dashboards are private — keep them out of search indexes. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TeacherLayout({
  children,
  params,
}: LayoutProps<"/[locale]/teacher">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardShell role="teacher">{children}</DashboardShell>;
}
