import { getTranslations } from "next-intl/server";
import { StarIcon, UsersIcon, ClockIcon } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import type { CourseListItem } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Course summary card for catalog grids. Pure Server Component — the active
 * `locale` is passed in so price/number formatting stays locale-aware without
 * a client hook.
 */
export async function CourseCard({
  course,
  locale,
}: {
  course: CourseListItem;
  locale: Locale;
}) {
  const t = await getTranslations("courses");

  const price =
    course.price === 0
      ? t("free")
      : formatCurrency(course.price, locale, course.currency);

  return (
    <Card className="group gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link href={routes.course(course.slug)} className="flex flex-1 flex-col">
        <div className="bg-muted flex aspect-video items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {course.subject}
          </span>
        </div>
        <CardHeader className="pt-6">
          <span className="text-primary text-xs font-medium">
            {t(`level.${course.level}`)}
          </span>
          <CardTitle className="line-clamp-2 text-base">
            {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {course.summary}
          </p>
          <p className="text-muted-foreground text-xs">
            {t("by", { name: course.instructor.name })}
          </p>
          <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
              {formatNumber(course.ratingAverage, locale)}
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              {t("students", {
                count: formatNumber(course.studentsCount, locale),
              })}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {t("hours", {
                count: formatNumber(course.durationHours, locale),
              })}
            </span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="justify-between border-t pt-6">
        <span className="text-base font-semibold">{price}</span>
      </CardFooter>
    </Card>
  );
}
