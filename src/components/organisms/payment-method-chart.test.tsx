import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import {
  PaymentMethodChart,
  PAYMENT_METHOD_COLORS,
} from "./payment-method-chart";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("PaymentMethodChart", () => {
  it("colors each bar by its brand method", () => {
    renderWithIntl(
      <PaymentMethodChart
        data={[
          { method: "vodafone", label: "V.Cash", value: 100 },
          { method: "visa", label: "Visa", value: 80 },
        ]}
        max={100}
      />,
    );
    const bars = document.querySelectorAll('[data-slot="bar-chart-bar"]');
    expect((bars[0] as HTMLElement).style.backgroundColor).toBe(
      "rgb(230, 0, 0)",
    );
    expect((bars[1] as HTMLElement).style.backgroundColor).toBe(
      "rgb(20, 52, 203)",
    );
  });

  it("renders the category labels", () => {
    renderWithIntl(
      <PaymentMethodChart
        data={[{ method: "orange", label: "O.Cash", value: 50 }]}
      />,
    );
    expect(screen.getByText("O.Cash")).toBeInTheDocument();
  });

  it("exposes the brand palette as data", () => {
    expect(PAYMENT_METHOD_COLORS.mezza).toBe("#007300");
    expect(PAYMENT_METHOD_COLORS.mastercard).toBe("#000000");
  });

  it("lets an explicit color override the method", () => {
    renderWithIntl(
      <PaymentMethodChart
        data={[{ method: "vodafone", label: "X", value: 10, color: "#00ff00" }]}
      />,
    );
    const bar = document.querySelector(
      '[data-slot="bar-chart-bar"]',
    ) as HTMLElement;
    expect(bar.style.backgroundColor).toBe("rgb(0, 255, 0)");
  });
});
