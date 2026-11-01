import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function StudentDashboardPage({
  params,
}: PageProps<"/[locale]/student">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        {t("student.title")}
      </h1>
      <p className="text-muted-foreground">{t("student.subtitle")}</p>
    </div>
  );
}
