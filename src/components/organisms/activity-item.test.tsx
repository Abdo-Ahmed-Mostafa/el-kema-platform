import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { ActivityItem } from "./activity-item";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ul role="list">{ui}</ul>
    </NextIntlClientProvider>,
  );
}

function getItem() {
  return document.querySelector('[data-slot="activity-item"]');
}

describe("ActivityItem", () => {
  it("renders as a list item with the name and defaults to secondary", () => {
    renderWithIntl(
      <ActivityItem name="Ahmed enrolled" action="Enrolled" time="2m ago" />,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-slot", "activity-item");
    expect(item).toHaveAttribute("data-status", "secondary");
    expect(screen.getByText("Ahmed enrolled")).toBeInTheDocument();
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText("2m ago")).toBeInTheDocument();
  });

  it("marks the error status", () => {
    renderWithIntl(<ActivityItem status="error" name="Payment failed" />);
    expect(getItem()).toHaveAttribute("data-status", "error");
  });

  it("marks the warning status", () => {
    renderWithIntl(<ActivityItem status="warning" name="Low balance" />);
    expect(getItem()).toHaveAttribute("data-status", "warning");
  });

  it("renders a custom icon", () => {
    renderWithIntl(
      <ActivityItem
        name="Ahmed enrolled"
        icon={<svg data-testid="custom-icon" />}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("conveys status with a non-color, screen-reader affordance", () => {
    renderWithIntl(<ActivityItem status="error" name="Payment failed" />);
    // The localised status word is announced alongside the name (not color-only).
    expect(screen.getByText("Error:")).toBeInTheDocument();
  });

  it("accepts an explicit statusLabel override", () => {
    renderWithIntl(
      <ActivityItem
        status="warning"
        name="Low balance"
        statusLabel="Needs attention"
      />,
    );
    expect(screen.getByText("Needs attention:")).toBeInTheDocument();
  });
});
