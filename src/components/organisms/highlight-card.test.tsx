import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { HighlightCard } from "./highlight-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function getCard() {
  return document.querySelector('[data-slot="highlight-card"]');
}

describe("HighlightCard", () => {
  it("renders value and label and defaults to the students variant", () => {
    renderWithIntl(<HighlightCard value="1,204" label="Students" />);
    expect(screen.getByText("1,204")).toBeInTheDocument();
    expect(screen.getByText("Students")).toBeInTheDocument();
    expect(getCard()).toHaveAttribute("data-variant", "students");
  });

  it("marks the courses variant", () => {
    renderWithIntl(
      <HighlightCard variant="courses" value="42" label="Courses" />,
    );
    expect(getCard()).toHaveAttribute("data-variant", "courses");
  });

  it("renders a custom icon", () => {
    renderWithIntl(
      <HighlightCard
        value="42"
        label="Courses"
        icon={<svg data-testid="custom-icon" />}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
