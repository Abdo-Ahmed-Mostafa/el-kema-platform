import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { PlansCard } from "./plans-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const features = ["Feature A", "Feature B", "Feature C"];

describe("PlansCard", () => {
  it("renders a labelled article with title, price and all features", () => {
    renderWithIntl(
      <PlansCard title="Starter" price="$10" features={features} />,
    );
    const card = screen.getByRole("article", { name: "Starter" });
    expect(card).toHaveAttribute("data-state", "default");
    expect(screen.getByText("$10")).toBeInTheDocument();
    for (const f of features) {
      expect(screen.getByText(f)).toBeInTheDocument();
    }
  });

  it("falls back to the i18n CTA label", () => {
    renderWithIntl(<PlansCard title="Starter" price="$10" features={[]} />);
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  it("marks the Pro state and renders an optional badge", () => {
    renderWithIntl(
      <PlansCard
        state="pro"
        title="Pro"
        price="$20"
        features={features}
        badgeLabel="Popular"
      />,
    );
    expect(screen.getByRole("article", { name: "Pro" })).toHaveAttribute(
      "data-state",
      "pro",
    );
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("fires onCtaClick in button mode", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    renderWithIntl(
      <PlansCard
        title="Starter"
        price="$10"
        features={[]}
        ctaLabel="Choose"
        onCtaClick={onCtaClick}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Choose" }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });
});
