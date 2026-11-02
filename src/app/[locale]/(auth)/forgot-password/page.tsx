import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { routing } from "@/lib/i18n/routing";
import { LogoMark } from "@/components/icons";
import { ForgotPasswordForm } from "@/features/auth";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(resolved);
  const t = await getTranslations({ locale: resolved, namespace: "auth" });

  return buildMetadata({
    locale: resolved,
    path: routes.forgotPassword,
    title: t("forgotHeading"),
    description: t("forgotSubheading"),
  });
}

export default async function ForgotPasswordPage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <>
      <LogoMark size={144} />

      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[20px] leading-8 font-semibold text-foreground">
          {t("forgotHeading")}
        </h1>
        <p className="text-sm leading-5 text-text-body">
          {t("forgotSubheading")}
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-foreground">
        <Link href={routes.login} className="text-secondary underline">
          {t("backToLogin")}
        </Link>
      </p>
    </>
  );
}
