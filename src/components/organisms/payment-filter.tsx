"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import {
  VodafoneIcon,
  OrangeIcon,
  VisaIcon,
  MastercardIcon,
} from "@/components/icons";
import { FilterGroup, type FilterOption } from "./filter";

/**
 * Payment Filter — Figma 1032:10384.
 *
 * A FilterGroup preset for payment methods. It renders a brand icon + label
 * chip per method and reuses the Tag-based Filter (no restyling). Labels are
 * prop-driven; when a method's label is omitted it falls back to an i18n
 * string under `organisms.dashboard.payment.<method>`. Brand marks are DATA
 * (imported icons), not theme tokens.
 *
 * Selection is controlled via `value` / `onValueChange` and may be single or
 * multi select, mirroring FilterGroup.
 */
type PaymentFilterMethod = "vodafone" | "orange" | "visa" | "mastercard";

const PAYMENT_FILTER_ICONS: Record<
  PaymentFilterMethod,
  React.ComponentType<{ className?: string }>
> = {
  vodafone: VodafoneIcon,
  orange: OrangeIcon,
  visa: VisaIcon,
  mastercard: MastercardIcon,
};

type PaymentFilterItem = {
  method: PaymentFilterMethod;
  /** Overrides the default i18n label. */
  label?: React.ReactNode;
};

type PaymentFilterProps = Omit<
  React.ComponentProps<typeof FilterGroup>,
  "options" | "label"
> & {
  /** Methods to show; defaults to all four brands. */
  methods?: PaymentFilterItem[];
  /** Accessible group label; falls back to an i18n string. */
  label?: string;
};

const DEFAULT_METHODS: PaymentFilterItem[] = [
  { method: "vodafone" },
  { method: "orange" },
  { method: "visa" },
  { method: "mastercard" },
];

function PaymentFilter({
  methods = DEFAULT_METHODS,
  label,
  ...props
}: PaymentFilterProps) {
  const t = useTranslations("organisms");

  const options: FilterOption[] = methods.map((item) => {
    const Icon = PAYMENT_FILTER_ICONS[item.method];
    return {
      value: item.method,
      label: item.label ?? t(`dashboard.payment.${item.method}`),
      icon: <Icon className="size-4" />,
    };
  });

  return (
    <FilterGroup
      {...(props as React.ComponentProps<typeof FilterGroup>)}
      label={label ?? t("dashboard.payment.filterLabel")}
      options={options}
    />
  );
}

export { PaymentFilter, type PaymentFilterMethod, type PaymentFilterItem };
