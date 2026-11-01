import { getTranslations } from "next-intl/server";
import { StarIcon } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { routes } from "@/config/routes";
import type { Locale } from "@/config/locales";
import type { TeacherProfile } from "@/types";
import { formatNumber } from "@/lib/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Teacher summary card for the public directory. Server Component.
 */
export async function TeacherCard({
  teacher,
  locale,
}: {
  teacher: TeacherProfile;
  locale: Locale;
}) {
  const t = await getTranslations("teachers");
  const name = `${teacher.firstName} ${teacher.lastName}`;
  const initials =
    `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Link href={routes.teacher(teacher.username)}>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="size-14">
            {teacher.avatarUrl ? (
              <AvatarImage src={teacher.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{name}</CardTitle>
            {teacher.headline ? (
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {teacher.headline}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject) => (
              <span
                key={subject}
                className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs"
              >
                {subject}
              </span>
            ))}
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
              {t("rating", {
                rating: formatNumber(teacher.ratingAverage, locale),
                count: teacher.ratingCount,
              })}
            </span>
            <span>
              {t("coursesCount", { count: teacher.courseIds.length })}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
