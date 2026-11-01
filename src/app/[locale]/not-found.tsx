import { getTranslations } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-7xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <div className="flex max-w-md flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t("description")}</p>
      </div>
      <Link
        href={routes.home}
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
