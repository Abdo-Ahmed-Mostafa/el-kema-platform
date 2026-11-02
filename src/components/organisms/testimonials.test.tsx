import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Testimonials } from "./testimonials";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Testimonials", () => {
  it("renders a labelled article with name, role and review", () => {
    renderWithIntl(
      <Testimonials
        name="Sara"
        role="Student"
        review="Great course"
        avatarFallback="S"
      />,
    );
    const card = screen.getByRole("article", { name: "Sara" });
    expect(card).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Great course")).toBeInTheDocument();
  });

  it("exposes the rating as an accessible image", () => {
    renderWithIntl(
      <Testimonials
        name="Sara"
        review="Great"
        avatarFallback="S"
        rating={4}
        maxRating={5}
      />,
    );
    expect(screen.getByRole("img")).toHaveAccessibleName("4 / 5");
  });

  it("uses a custom rating label when provided", () => {
    renderWithIntl(
      <Testimonials
        name="Sara"
        review="Great"
        avatarFallback="S"
        rating={5}
        ratingLabel="Five stars"
      />,
    );
    expect(screen.getByRole("img")).toHaveAccessibleName("Five stars");
  });
});
