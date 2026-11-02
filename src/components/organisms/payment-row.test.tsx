import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { PaymentRow } from "./payment-row";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ul>{ui}</ul>
    </NextIntlClientProvider>,
  );
}

describe("PaymentRow", () => {
  it("renders the label, detail and amount", () => {
    renderWithIntl(
      <PaymentRow
        method="vodafone"
        label="Vodafone Cash"
        detail="•••• 1234"
        amount="250 EGP"
      />,
    );
    expect(screen.getByText("Vodafone Cash")).toBeInTheDocument();
    expect(screen.getByText("•••• 1234")).toBeInTheDocument();
    expect(screen.getByText("250 EGP")).toBeInTheDocument();
  });

  it("renders a list item carrying the method", () => {
    renderWithIntl(<PaymentRow method="orange" label="Orange Cash" />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-method", "orange");
  });

  it("renders a brand icon svg for the method", () => {
    renderWithIntl(<PaymentRow method="visa" label="Visa" />);
    expect(
      screen.getByRole("listitem").querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("supports an icon override", () => {
    renderWithIntl(
      <PaymentRow label="Custom" icon={<svg data-testid="custom-icon" />} />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
