import * as React from "react";

import { BarChart, type BarChartDatum } from "./bar-chart";

/**
 * Payment Method Chart — Figma 1030:10140.
 *
 * A thin preset over BarChart that colors each bar by payment method using the
 * brand hex values. Those brand colors are DATA (not theme tokens): they live
 * here in the preset, never in globals.css. A caller passes
 * `{ method, label, value }` rows and the preset resolves the bar color from
 * `method`; an explicit `color` on a datum still wins.
 */
type PaymentMethod = "vodafone" | "orange" | "mastercard" | "mezza" | "visa";

/** Brand palette (DATA, not design tokens). */
const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  vodafone: "#e60000",
  orange: "#ff7900",
  mastercard: "#000000",
  mezza: "#007300",
  visa: "#1434cb",
};

type PaymentMethodDatum = {
  /** Payment method, selects the brand bar color. */
  method?: PaymentMethod;
  /** Category label shown below the bar. */
  label: string;
  /** Bar value. */
  value: number;
  /** Explicit color override (wins over `method`). */
  color?: string;
};

type PaymentMethodChartProps = Omit<
  React.ComponentProps<typeof BarChart>,
  "data"
> & {
  /** Rows with a `method` that maps to a brand color. */
  data: PaymentMethodDatum[];
};

function PaymentMethodChart({ data, ...props }: PaymentMethodChartProps) {
  const bars: BarChartDatum[] = data.map((datum) => ({
    label: datum.label,
    value: datum.value,
    color:
      datum.color ??
      (datum.method ? PAYMENT_METHOD_COLORS[datum.method] : undefined),
  }));

  return <BarChart data={bars} {...props} />;
}

export {
  PaymentMethodChart,
  PAYMENT_METHOD_COLORS,
  type PaymentMethod,
  type PaymentMethodDatum,
};
