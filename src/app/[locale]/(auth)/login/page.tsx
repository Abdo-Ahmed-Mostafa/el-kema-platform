import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import { routing } from "@/lib/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth";
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
    path: routes.login,
    title: t("loginTitle"),
    description: t("loginSubtitle"),
  });
}

export default async function LoginPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LoginForm />
        <p className="text-muted-foreground text-center text-sm">
          {t("noAccount")}{" "}
          <Link
            href={routes.register}
            className="text-primary font-medium hover:underline"
          >
            {t("registerCta")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
