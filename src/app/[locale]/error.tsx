"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { ErrorState } from "@/components/shared/error-state";

/**
 * Error boundary for the locale subtree. Catches render/runtime errors in
 * pages and nested layouts below `[locale]` and offers a retry via `reset`.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Hook point for error reporting (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <ErrorState
        title={t("title")}
        description={t("description")}
        retryLabel={t("retry")}
        onRetry={reset}
      />
    </div>
  );
}
