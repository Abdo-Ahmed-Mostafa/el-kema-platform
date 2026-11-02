import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { ProgressTrackingCard } from "./progress-tracking-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const baseProps = {
  value: 25,
  badgeLabel: "Math course",
  greeting: "Welcome back!",
  body: "Keep learning.",
  meta: { timeLeft: "35 min left", lesson: "Lesson 8 of 20", grade: "Grade" },
  ctaLabel: "Continue learning",
};

describe("ProgressTrackingCard", () => {
  it("renders greeting, body, badge, meta and CTA", () => {
    renderWithIntl(<ProgressTrackingCard {...baseProps} />);
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    expect(screen.getByText("Keep learning.")).toBeInTheDocument();
    expect(screen.getByText("Math course")).toBeInTheDocument();
    expect(screen.getByText("35 min left")).toBeInTheDocument();
    expect(screen.getByText("Lesson 8 of 20")).toBeInTheDocument();
    expect(screen.getByText("Continue learning")).toBeInTheDocument();
  });

  it("renders the inverse progress ring with the given value", () => {
    renderWithIntl(<ProgressTrackingCard {...baseProps} value={25} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "25");
    expect(bar).toHaveAttribute("data-state", "inverse");
  });

  it("applies the surface data attribute (primary vs secondary)", () => {
    const { rerender } = renderWithIntl(
      <ProgressTrackingCard {...baseProps} surface="primary" />,
    );
    expect(screen.getByRole("article")).toHaveAttribute(
      "data-surface",
      "primary",
    );

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ProgressTrackingCard {...baseProps} surface="secondary" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("article")).toHaveAttribute(
      "data-surface",
      "secondary",
    );
  });

  it("renders a link when href is provided", () => {
    renderWithIntl(<ProgressTrackingCard {...baseProps} href="/learn" />);
    expect(
      screen.getByRole("link", { name: "Continue learning" }),
    ).toHaveAttribute("href", "/learn");
  });
});
