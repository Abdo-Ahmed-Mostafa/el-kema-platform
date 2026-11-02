import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { DashboardMetricCard } from "./dashboard-metric-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function getCard() {
  return document.querySelector('[data-slot="dashboard-metric-card"]');
}

describe("DashboardMetricCard", () => {
  it("renders label and value and defaults to the default state", () => {
    renderWithIntl(
      <DashboardMetricCard label="Active students" value="1,204" />,
    );
    expect(screen.getByText("Active students")).toBeInTheDocument();
    expect(screen.getByText("1,204")).toBeInTheDocument();
    expect(getCard()).toHaveAttribute("data-state", "default");
  });

  it("marks the hover state", () => {
    renderWithIntl(
      <DashboardMetricCard state="hover" label="Revenue" value="$3,400" />,
    );
    expect(getCard()).toHaveAttribute("data-state", "hover");
  });

  it("renders the optional trend badge", () => {
    renderWithIntl(
      <DashboardMetricCard label="Revenue" value="$3,400" trendLabel="+12%" />,
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    renderWithIntl(
      <DashboardMetricCard
        label="Revenue"
        value="$3,400"
        icon={<svg data-testid="custom-icon" />}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
