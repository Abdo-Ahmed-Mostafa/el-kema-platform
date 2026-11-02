import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { OurWorkCard } from "./our-work-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("OurWorkCard", () => {
  it("renders the image alt, title, badge and i18n CTA", () => {
    renderWithIntl(
      <OurWorkCard
        imageSrc="/work.jpg"
        imageAlt="Project cover"
        title="Project One"
        body="A short summary."
        badgeLabel="Case study"
      />,
    );
    expect(
      screen.getByRole("article", { name: "Project One" }),
    ).toHaveAttribute("data-state", "default");
    expect(screen.getByAltText("Project cover")).toBeInTheDocument();
    expect(screen.getByText("Case study")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Read more" }),
    ).toBeInTheDocument();
  });

  it("reflects the hover state via data-state", () => {
    renderWithIntl(
      <OurWorkCard
        state="hover"
        imageSrc="/work.jpg"
        imageAlt="Cover"
        title="Hovered"
      />,
    );
    expect(screen.getByRole("article", { name: "Hovered" })).toHaveAttribute(
      "data-state",
      "hover",
    );
  });
});
