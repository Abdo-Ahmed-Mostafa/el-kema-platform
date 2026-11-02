import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { StudentOverview } from "./student-overview";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("StudentOverview", () => {
  it("renders a labelled stat with its value", () => {
    renderWithIntl(<StudentOverview label="Courses" value="12" />);
    const stat = screen.getByText("12");
    expect(stat).toBeInTheDocument();
    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("defaults to the secondary tone and reflects it as a data attribute", () => {
    const { container } = renderWithIntl(
      <StudentOverview label="Courses" value="12" />,
    );
    expect(
      container.querySelector('[data-slot="student-overview"]'),
    ).toHaveAttribute("data-tone", "secondary");
  });

  it("applies the accent tone when requested", () => {
    const { container } = renderWithIntl(
      <StudentOverview label="Courses" value="12" tone="accent" />,
    );
    expect(
      container.querySelector('[data-slot="student-overview"]'),
    ).toHaveAttribute("data-tone", "accent");
  });
});
