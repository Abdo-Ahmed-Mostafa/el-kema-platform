"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { DownArrowIcon } from "@/components/icons";

type AccordionContextValue = {
  /** Set of currently-open item values. */
  openItems: Set<string>;
  /** Toggle an item open/closed by value. */
  toggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return ctx;
}

type AccordionProps = React.ComponentProps<"div"> & {
  /**
   * "single" keeps at most one item open at a time; "multiple" allows any
   * number open. Defaults to "single".
   */
  type?: "single" | "multiple";
  /** Uncontrolled initial open value(s). */
  defaultValue?: string | string[];
};

/**
 * FAQ Accordion — accessible NATIVE disclosure group (no @radix-ui dependency).
 *
 * Each row is a header `<button aria-expanded aria-controls>` paired with a
 * `<div role="region" aria-labelledby>` panel (see AccordionItem). The chevron
 * rotates via `data-state`. Surface/border/radius use semantic tokens so dark
 * mode follows automatically.
 */
function Accordion({
  className,
  type = "single",
  defaultValue,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue == null) return new Set();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  });

  const toggle = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (type === "single") next.clear();
          next.add(value);
        }
        return next;
      });
    },
    [type],
  );

  const ctx = React.useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        data-slot="accordion"
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Unique value identifying this item within the group. */
  value: string;
  /** The question / header content. */
  title: React.ReactNode;
};

/**
 * AccordionItem — one disclosure row. The header is a real `<button>` whose
 * `aria-expanded` reflects the open state and whose `aria-controls` points at
 * the panel; the panel is a labelled `role="region"`. Enter/Space toggle it
 * natively (it is a button) and the chevron rotates via `data-state`.
 */
function AccordionItem({
  className,
  value,
  title,
  children,
  ...props
}: AccordionItemProps) {
  const { openItems, toggle } = useAccordionContext();
  const t = useTranslations("molecules");
  const reactId = React.useId();
  const triggerId = `${reactId}-trigger`;
  const panelId = `${reactId}-panel`;
  const open = openItems.has(value);

  return (
    <div
      data-slot="accordion-item"
      data-state={open ? "open" : "closed"}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
      {...props}
    >
      <h3 className="flex">
        <button
          type="button"
          id={triggerId}
          data-slot="accordion-trigger"
          data-state={open ? "open" : "closed"}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t("collapse") : t("expand")}
          onClick={() => toggle(value)}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start text-[20px] leading-8 font-medium text-foreground transition-colors outline-none hover:bg-primary-light focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-primary"
        >
          {/* paragraph-lg (20/32) — not a token; arbitrary per figma-molecules.md */}
          <span>{title}</span>
          <DownArrowIcon
            aria-hidden
            className="transition-transform duration-200 data-[state=open]:rotate-180"
            data-state={open ? "open" : "closed"}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        data-slot="accordion-content"
        data-state={open ? "open" : "closed"}
        className="px-4 pb-4 text-sm text-[#52525a] dark:text-zinc-400"
      >
        {/* body: paragraph-xsm, #52525a is not a token (figma-molecules.md) */}
        {children}
      </div>
    </div>
  );
}

export { Accordion, AccordionItem };
