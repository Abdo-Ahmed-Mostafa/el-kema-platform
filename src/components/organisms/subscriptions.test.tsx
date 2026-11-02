import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Subscriptions } from "./subscriptions";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function getCard() {
  return document.querySelector('[data-slot="subscriptions"]');
}

describe("Subscriptions", () => {
  it("renders label and value and defaults to the active status", () => {
    renderWithIntl(<Subscriptions label="Active" value="320" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("320")).toBeInTheDocument();
    expect(getCard()).toHaveAttribute("data-status", "active");
  });

  it("marks the expired status", () => {
    renderWithIntl(
      <Subscriptions status="expired" label="Expired" value="18" />,
    );
    expect(getCard()).toHaveAttribute("data-status", "expired");
  });

  it("marks the cancelled status", () => {
    renderWithIntl(
      <Subscriptions status="cancelled" label="Cancelled" value="4" />,
    );
    expect(getCard()).toHaveAttribute("data-status", "cancelled");
  });

  it("renders a custom icon", () => {
    renderWithIntl(
      <Subscriptions
        label="Active"
        value="320"
        icon={<svg data-testid="custom-icon" />}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
