import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { OfferCard } from "./offer-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const baseProps = {
  illustrationSrc: "/home/offer-instructor.png",
  illustrationAlt: "Teacher illustration",
  badgeLabel: "Suggested for you",
  title: "A teacher that fits you",
  body: "Meet specialized teachers.",
  ctaLabel: "View profile",
};

describe("OfferCard", () => {
  it("renders badge, title, body, CTA and illustration", () => {
    renderWithIntl(<OfferCard {...baseProps} />);
    expect(screen.getByText("Suggested for you")).toBeInTheDocument();
    expect(screen.getByText("A teacher that fits you")).toBeInTheDocument();
    expect(screen.getByText("Meet specialized teachers.")).toBeInTheDocument();
    expect(screen.getByText("View profile")).toBeInTheDocument();
    expect(screen.getByAltText("Teacher illustration")).toBeInTheDocument();
  });

  it("toggles the surface via the data attribute", () => {
    const { rerender } = renderWithIntl(
      <OfferCard {...baseProps} surface="teal" />,
    );
    expect(
      screen.getByText("A teacher that fits you").closest("section"),
    ).toHaveAttribute("data-surface", "teal");

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <OfferCard {...baseProps} surface="gold" />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByText("A teacher that fits you").closest("section"),
    ).toHaveAttribute("data-surface", "gold");
  });

  it("renders a link when href is provided", () => {
    renderWithIntl(<OfferCard {...baseProps} href="/teachers" />);
    expect(screen.getByRole("link", { name: "View profile" })).toHaveAttribute(
      "href",
      "/teachers",
    );
  });
});
