import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { PersonIcon } from "@/components/icons";

/**
 * Student Data — Figma 1173:24352.
 *
 * A labelled student-data field row: a title (paragraph-sm semibold, primary)
 * above a description (paragraph-xxsm, body), with a 40px primary icon chip at
 * the block end. Consumers stack several rows to build a details panel.
 *
 * Content is prop-driven; it composes an icon ReactNode without restyling it.
 * Layout uses logical properties (text-end, start/end order) so it mirrors in
 * RTL/LTR.
 */
type StudentDataProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Field title (paragraph-sm semibold). */
  title: React.ReactNode;
  /** Field value / description (paragraph-xxsm, body). */
  description?: React.ReactNode;
  /** Icon rendered inside the primary chip; defaults to the person icon. */
  icon?: React.ReactNode;
};

const StudentData = React.forwardRef<HTMLDivElement, StudentDataProps>(
  function StudentData({ className, title, description, icon, ...props }, ref) {
    const titleId = React.useId();

    return (
      <div
        ref={ref}
        data-slot="student-data"
        aria-labelledby={titleId}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-6 py-4 text-start",
          className,
        )}
        {...props}
      >
        <div className="flex flex-1 flex-col gap-2 text-end">
          <p
            id={titleId}
            className="text-base leading-6 font-semibold text-primary"
          >
            {title}
          </p>
          {description != null ? (
            <p className="text-xs leading-4 text-body">{description}</p>
          ) : null}
        </div>
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground [&>svg]:size-5"
        >
          {icon ?? <PersonIcon className="size-5" />}
        </span>
      </div>
    );
  },
);

export { StudentData };
