import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TeacherDashboardPage({
  params,
}: PageProps<"/[locale]/teacher">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        {t("teacher.title")}
      </h1>
      <p className="text-muted-foreground">{t("teacher.subtitle")}</p>
    </div>
  );
}
