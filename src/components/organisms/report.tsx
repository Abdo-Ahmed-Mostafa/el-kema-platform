import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "@/components/icons";

/**
 * Report — Figma 1126:19055, states Course / Student / Exam / Lecture.
 *
 * A real, semantic data table: `Report` renders a `<table>` with a
 * `<thead>`/`<tbody>`, while each `ReportRow` renders a `<tr>` whose `variant`
 * selects which columns appear. The header row is driven by a per-variant
 * `columns` config whose labels fall back to `organisms.dashboard.report.*`.
 *
 * Columns observed per variant:
 *  - course  — course name, date, students count, amount, details, actions
 *  - student — student name, code, grade, date, actions
 *  - exam    — quiz name, exam number, mark, pass/fail badge, actions
 *  - lecture — system/lecture name, attendance time, actions
 *
 * Composes the Badge atom (pass/fail) and icon Buttons (view/delete) without
 * restyling them. Alignment uses logical properties (text-start/text-end) so
 * the table mirrors cleanly in RTL/LTR.
 */
type ReportVariant = "course" | "student" | "exam" | "lecture";

type ReportColumnKey =
  | "name"
  | "date"
  | "students"
  | "amount"
  | "details"
  | "code"
  | "grade"
  | "examNumber"
  | "mark"
  | "status"
  | "attendance"
  | "actions";

/** i18n keys for the default header label of each column key, per variant. */
const COLUMN_SETS: Record<ReportVariant, ReportColumnKey[]> = {
  course: ["name", "date", "students", "amount", "details", "actions"],
  student: ["name", "code", "grade", "date", "actions"],
  exam: ["name", "examNumber", "mark", "status", "actions"],
  lecture: ["name", "attendance", "actions"],
};

/** Fallback i18n label key for each column key (under organisms.dashboard.report). */
const COLUMN_LABEL_KEYS: Record<ReportColumnKey, string> = {
  name: "name",
  date: "date",
  students: "students",
  amount: "amount",
  details: "details",
  code: "code",
  grade: "grade",
  examNumber: "examNumber",
  mark: "mark",
  status: "status",
  attendance: "attendance",
  actions: "actions",
};

type ReportColumn = {
  /** Column identity — maps a cell to a header. */
  key: ReportColumnKey;
  /** Override header label; falls back to i18n. */
  label?: React.ReactNode;
  /** Trailing / numeric columns align to the end. */
  align?: "start" | "end";
};

function useColumns(variant: ReportVariant, columns?: ReportColumn[]) {
  const t = useTranslations("organisms");
  const resolved: ReportColumn[] =
    columns ?? COLUMN_SETS[variant].map((key) => ({ key }));
  return resolved.map((column) => ({
    ...column,
    label:
      column.label ?? t(`dashboard.report.${COLUMN_LABEL_KEYS[column.key]}`),
  }));
}

/* ------------------------------------------------------------------ Report */

type ReportProps = Omit<React.ComponentProps<"table">, "children"> & {
  /** Row variant; also drives the default header columns. */
  variant: ReportVariant;
  /** Override the column config (order + labels + alignment). */
  columns?: ReportColumn[];
  /** Accessible table caption (visually hidden). */
  caption?: React.ReactNode;
  /** `ReportRow`s of the same `variant`. */
  children: React.ReactNode;
};

const Report = React.forwardRef<HTMLTableElement, ReportProps>(function Report(
  { className, variant, columns, caption, children, ...props },
  ref,
) {
  const resolved = useColumns(variant, columns);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card shadow-card">
      <table
        ref={ref}
        data-slot="report"
        data-variant={variant}
        className={cn("w-full border-collapse text-start", className)}
        {...props}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-border">
            {resolved.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-4 py-4 text-xs leading-4 font-medium text-body",
                  column.align === "end" ? "text-end" : "text-start",
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
});

/* --------------------------------------------------------------- ReportRow */

type ReportActions = {
  /** Show the view / details icon button. */
  view?: boolean;
  /** Show the delete icon button. */
  delete?: boolean;
  onView?: React.MouseEventHandler<HTMLButtonElement>;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible labels; fall back to i18n. */
  viewLabel?: string;
  deleteLabel?: string;
};

type ReportRowProps = Omit<React.ComponentProps<"tr">, "children"> & {
  /** Must match the owning `Report` variant. */
  variant: ReportVariant;
  /** The row name / title cell (course/student/quiz/system name). */
  name: React.ReactNode;
  date?: React.ReactNode;
  students?: React.ReactNode;
  amount?: React.ReactNode;
  details?: React.ReactNode;
  code?: React.ReactNode;
  grade?: React.ReactNode;
  examNumber?: React.ReactNode;
  mark?: React.ReactNode;
  attendance?: React.ReactNode;
  /** Exam pass/fail state; `false` renders the error (fail) badge. */
  passed?: boolean;
  /** Row action buttons (view / delete). */
  actions?: ReportActions;
};

const ReportRow = React.forwardRef<HTMLTableRowElement, ReportRowProps>(
  function ReportRow(
    {
      className,
      variant,
      name,
      date,
      students,
      amount,
      details,
      code,
      grade,
      examNumber,
      mark,
      attendance,
      passed,
      actions,
      ...props
    },
    ref,
  ) {
    const t = useTranslations("organisms");

    const cellBase = "px-4 py-4 text-sm leading-5 text-foreground";
    const cellStart = cn(cellBase, "text-start");
    const cellEnd = cn(cellBase, "text-end");

    const actionsCell = (
      <td className={cellEnd}>
        <div className="flex items-center justify-end gap-2">
          {actions?.view ? (
            <Button
              type="button"
              variant="primary"
              appearance="ghost"
              size="icon"
              className="size-9"
              aria-label={actions.viewLabel ?? t("dashboard.report.view")}
              onClick={actions.onView}
            >
              <EditIcon className="size-5" />
            </Button>
          ) : null}
          {actions?.delete ? (
            <Button
              type="button"
              variant="destructive"
              appearance="ghost"
              size="icon"
              className="size-9"
              aria-label={actions.deleteLabel ?? t("dashboard.report.delete")}
              onClick={actions.onDelete}
            >
              <TrashIcon className="size-5" />
            </Button>
          ) : null}
        </div>
      </td>
    );

    return (
      <tr
        ref={ref}
        data-slot="report-row"
        data-variant={variant}
        className={cn("border-b border-border last:border-0", className)}
        {...props}
      >
        <th scope="row" className={cn(cellStart, "font-medium")}>
          {name}
        </th>

        {variant === "course" ? (
          <>
            <td className={cellStart}>{date}</td>
            <td className={cellStart}>{students}</td>
            <td className={cellEnd}>{amount}</td>
            <td className={cellStart}>{details}</td>
          </>
        ) : null}

        {variant === "student" ? (
          <>
            <td className={cellStart}>{code}</td>
            <td className={cellStart}>{grade}</td>
            <td className={cellStart}>{date}</td>
          </>
        ) : null}

        {variant === "exam" ? (
          <>
            <td className={cellStart}>{examNumber}</td>
            <td className={cellEnd}>{mark}</td>
            <td className={cellStart}>
              {passed != null ? (
                <Badge variant={passed ? "accent" : "error"} tone="light">
                  {passed
                    ? t("dashboard.report.pass")
                    : t("dashboard.report.fail")}
                </Badge>
              ) : null}
            </td>
          </>
        ) : null}

        {variant === "lecture" ? (
          <>
            <td className={cellStart}>{attendance}</td>
          </>
        ) : null}

        {actionsCell}
      </tr>
    );
  },
);

export {
  Report,
  ReportRow,
  COLUMN_SETS,
  type ReportVariant,
  type ReportColumn,
  type ReportColumnKey,
  type ReportActions,
};
