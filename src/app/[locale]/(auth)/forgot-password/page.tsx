import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ForgotPasswordPage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("forgotPassword")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center text-sm">
          <Link
            href={routes.login}
            className="text-primary font-medium hover:underline"
          >
            {t("loginCta")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
