import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SigmaIcon,
  StopwatchIcon,
  CalendarIcon,
  InfoIcon,
} from "@/components/icons";

/**
 * Exam Card — Figma 1166:23315.
 *
 * An exam summary card: a header pairing an optional status Badge with the
 * exam name (paragraph-xsm medium) and grade level (muted); a 2-column grid of
 * accent info chips (questions / duration / date), each an accent-surface pill
 * with a leading value and a trailing icon; and a full-width primary CTA.
 *
 * Content is prop-driven; it composes the Badge and Button atoms plus icon
 * ReactNodes without restyling them. Layout uses logical properties so it
 * mirrors in RTL/LTR.
 */
type ExamCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  /** Exam name (paragraph-xsm medium). */
  examName: React.ReactNode;
  /** Grade level / subtitle (muted). */
  gradeLevel?: React.ReactNode;
  /** Status badge label; omit to hide. */
  badgeLabel?: React.ReactNode;
  /**
   * Status badge color variant. By design this mirrors the Badge atom's
   * `variant` union (which uses "error", not the Button atom's "destructive")
   * because the value is forwarded straight to <Badge variant={...}>; keeping
   * the two in lock-step is the intentional, consistent choice.
   */
  badgeVariant?: React.ComponentProps<typeof Badge>["variant"];
  /** Questions count. */
  questions?: React.ReactNode;
  /** Duration text. */
  duration?: React.ReactNode;
  /** Date text. */
  date?: React.ReactNode;
  /** CTA label; falls back to i18n. */
  ctaLabel?: React.ReactNode;
  /** CTA href (renders the Button as a link). */
  ctaHref?: string;
  /** CTA click handler (button mode). */
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Info-chip label overrides; fall back to i18n. */
  questionsLabel?: string;
  durationLabel?: string;
  dateLabel?: string;
};

function InfoChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-sm border border-accent bg-accent px-3 py-2 text-accent-foreground">
      <span className="text-xs leading-4" aria-label={label}>
        {value}
      </span>
      <span aria-hidden className="[&>svg]:size-4">
        {icon}
      </span>
    </div>
  );
}

const ExamCard = React.forwardRef<HTMLElement, ExamCardProps>(function ExamCard(
  {
    className,
    examName,
    gradeLevel,
    badgeLabel,
    badgeVariant = "secondary",
    questions,
    duration,
    date,
    ctaLabel,
    ctaHref,
    onCtaClick,
    questionsLabel,
    durationLabel,
    dateLabel,
    ...props
  },
  ref,
) {
  const t = useTranslations("organisms");
  const headingId = React.useId();
  const cta = ctaLabel ?? t("dashboard.examCard.activate");

  return (
    <article
      ref={ref}
      data-slot="exam-card"
      aria-labelledby={headingId}
      className={cn(
        "flex w-full max-w-[328px] flex-col gap-6 rounded-card-xl border border-border bg-card p-6 text-start shadow-card",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        {badgeLabel ? (
          <Badge variant={badgeVariant}>
            <InfoIcon aria-hidden />
            {badgeLabel}
          </Badge>
        ) : null}
        <div className="flex flex-col gap-2 text-end">
          <p
            id={headingId}
            className="text-sm leading-5 font-medium text-foreground"
          >
            {examName}
          </p>
          {gradeLevel ? (
            <p className="text-xs leading-4 text-body">{gradeLevel}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {questions != null ? (
          <InfoChip
            label={questionsLabel ?? t("dashboard.examCard.questions")}
            value={questions}
            icon={<SigmaIcon />}
          />
        ) : null}
        {duration != null ? (
          <InfoChip
            label={durationLabel ?? t("dashboard.examCard.duration")}
            value={duration}
            icon={<StopwatchIcon />}
          />
        ) : null}
        {date != null ? (
          <InfoChip
            label={dateLabel ?? t("dashboard.examCard.date")}
            value={date}
            icon={<CalendarIcon />}
          />
        ) : null}
      </div>

      {ctaHref ? (
        <Button
          asChild
          size="sm"
          className="w-full"
          variant="primary"
          appearance="filled"
        >
          <a href={ctaHref}>{cta}</a>
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          className="w-full"
          variant="primary"
          appearance="filled"
          onClick={onCtaClick}
        >
          {cta}
        </Button>
      )}
    </article>
  );
});

export { ExamCard };
