import * as React from "react";

import { cn } from "@/lib/utils/cn";
import {
  VodafoneIcon,
  OrangeIcon,
  VisaIcon,
  MastercardIcon,
} from "@/components/icons";

/**
 * Payment Row — Figma 1049:12711, Vodafone / Orange / Visa.
 *
 * A single payment-method row rendered as an <li> (consumers wrap a set in
 * <ul role="list">). The row carries a leading brand icon chosen by the
 * `method` prop (Vodafone/Orange/Visa/Mastercard), falling back to an `icon`
 * override, the method `label` (paragraph-sm medium), an optional masked
 * `detail`, and an optional `amount` shown in the method's brand color
 * (paragraph-lg semibold).
 *
 * Brand hex colors are DATA and live here in the component, not in globals.css.
 * Content is prop-driven; layout uses logical properties so it mirrors in
 * RTL/LTR.
 */
type PaymentRowMethod = "vodafone" | "orange" | "visa" | "mastercard";

/** Brand marks keyed by method (DATA, not design tokens). */
const PAYMENT_ROW_ICONS: Record<
  PaymentRowMethod,
  React.ComponentType<{ className?: string }>
> = {
  vodafone: VodafoneIcon,
  orange: OrangeIcon,
  visa: VisaIcon,
  mastercard: MastercardIcon,
};

/** Brand text color for the amount (DATA, not design tokens). */
const PAYMENT_ROW_AMOUNT_COLORS: Record<PaymentRowMethod, string> = {
  vodafone: "#e60000",
  orange: "#ff7900",
  visa: "#1434cb",
  mastercard: "#000000",
};

type PaymentRowProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** Payment method; selects the brand icon + amount color. */
  method?: PaymentRowMethod;
  /** Icon override; wins over `method`. */
  icon?: React.ReactNode;
  /** Method name (paragraph-sm medium). */
  label: React.ReactNode;
  /** Optional masked number / secondary detail. */
  detail?: React.ReactNode;
  /** Optional amount, rendered in the brand color (paragraph-lg semibold). */
  amount?: React.ReactNode;
};

const PaymentRow = React.forwardRef<HTMLLIElement, PaymentRowProps>(
  function PaymentRow(
    { className, method, icon, label, detail, amount, ...props },
    ref,
  ) {
    const BrandIcon = method ? PAYMENT_ROW_ICONS[method] : undefined;
    const amountColor = method ? PAYMENT_ROW_AMOUNT_COLORS[method] : undefined;

    return (
      <li
        ref={ref}
        data-slot="payment-row"
        data-method={method}
        className={cn(
          "flex w-full items-center justify-between gap-3 py-3 text-start",
          className,
        )}
        {...props}
      >
        <div className="flex flex-1 items-center gap-3">
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center [&>svg]:size-8"
          >
            {icon ?? (BrandIcon ? <BrandIcon className="size-8" /> : null)}
          </span>
          <div className="flex flex-col">
            <span className="text-base leading-6 font-medium text-foreground">
              {label}
            </span>
            {detail != null ? (
              <span className="text-xs leading-4 text-body">{detail}</span>
            ) : null}
          </div>
        </div>
        {amount != null ? (
          <span
            className="text-xl leading-8 font-semibold"
            style={amountColor ? { color: amountColor } : undefined}
          >
            {amount}
          </span>
        ) : null}
      </li>
    );
  },
);

export { PaymentRow, type PaymentRowMethod };
