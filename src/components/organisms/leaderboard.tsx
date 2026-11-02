import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MedalIcon } from "@/components/icons";

/**
 * Leaderboard — Figma 881:9322, a single profile score card (~318px).
 *
 * A large avatar, the student name (paragraph-sm) and school (body), then a
 * primary-surface row with two inverse-text score columns (subject / total)
 * split by a logical vertical divider. An optional medal badge (`medal`) and
 * `rank` support stacking several cards into a ranked list by the consumer.
 * Composes the Avatar atom and the MedalIcon; `shadow-card` + `rounded-xl`.
 */
type LeaderboardProps = React.ComponentProps<"article"> & {
  /** Student name. */
  name: React.ReactNode;
  /** School / affiliation line. */
  school?: React.ReactNode;
  /** Avatar image source. */
  avatarSrc?: string;
  /** Avatar fallback (initials) when no image loads. */
  avatarFallback: React.ReactNode;
  /** Subject score value. */
  subjectScore: React.ReactNode;
  /** Total score value. */
  totalScore: React.ReactNode;
  /** Label for the subject column; falls back to i18n. */
  subjectScoreLabel?: React.ReactNode;
  /** Label for the total column; falls back to i18n. */
  totalScoreLabel?: React.ReactNode;
  /** Optional rank (1-based) — shown as a corner badge. */
  rank?: number;
  /** Show the medal badge. */
  medal?: boolean;
};

const Leaderboard = React.forwardRef<HTMLElement, LeaderboardProps>(
  function Leaderboard(
    {
      className,
      name,
      school,
      avatarSrc,
      avatarFallback,
      subjectScore,
      totalScore,
      subjectScoreLabel,
      totalScoreLabel,
      rank,
      medal,
      ...props
    },
    ref,
  ) {
    const t = useTranslations("organisms");
    const headingId = React.useId();
    const subjectLabel = subjectScoreLabel ?? t("leaderboard.subjectScore");
    const totalLabel = totalScoreLabel ?? t("leaderboard.totalScore");

    return (
      <article
        ref={ref}
        data-slot="leaderboard"
        aria-labelledby={headingId}
        className={cn(
          "relative flex w-full max-w-[318px] flex-col items-center gap-4 rounded-xl border border-border bg-gradient-to-b from-card to-primary-light p-6 text-center shadow-card",
          className,
        )}
        {...props}
      >
        {rank != null ? (
          <span className="absolute top-4 start-4 flex min-w-7 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs leading-4 font-semibold text-primary-foreground">
            {t("leaderboard.rank", { rank })}
          </span>
        ) : null}
        {medal ? (
          <span className="absolute top-4 end-4 text-warning" aria-hidden>
            <MedalIcon className="size-6" />
          </span>
        ) : null}

        <Avatar className="size-[150px]">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="text-[28px] leading-10 font-bold text-primary">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <h3
            id={headingId}
            className="text-base leading-6 font-medium text-foreground"
          >
            {name}
          </h3>
          {school ? (
            <p className="text-body text-sm leading-5">{school}</p>
          ) : null}
        </div>

        <div className="flex w-full items-stretch rounded-lg bg-primary text-primary-foreground">
          <div className="flex flex-1 flex-col items-center gap-1 p-4">
            <span className="text-xs leading-4 opacity-80">{subjectLabel}</span>
            <span className="text-[20px] leading-8 font-bold">
              {subjectScore}
            </span>
          </div>
          <div className="w-px bg-primary-foreground/20" aria-hidden />
          <div className="flex flex-1 flex-col items-center gap-1 p-4">
            <span className="text-xs leading-4 opacity-80">{totalLabel}</span>
            <span className="text-[20px] leading-8 font-bold">
              {totalScore}
            </span>
          </div>
        </div>
      </article>
    );
  },
);

export { Leaderboard };
