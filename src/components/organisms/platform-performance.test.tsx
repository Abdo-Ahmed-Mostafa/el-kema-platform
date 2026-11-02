import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { PlatformPerformance } from "./platform-performance";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const data = [
  { label: "Jan", value: 1000 },
  { label: "Feb", value: 2000 },
  { label: "Mar", value: 1500 },
];

describe("PlatformPerformance", () => {
  it("renders an img-role figure with an aria-label", () => {
    renderWithIntl(<PlatformPerformance title="Revenue" data={data} />);
    const figure = screen.getByRole("img");
    expect(figure).toBeInTheDocument();
    expect(figure).toHaveAccessibleName(/Revenue/);
  });

  it("renders every x-axis label", () => {
    renderWithIntl(<PlatformPerformance title="Revenue" data={data} />);
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Feb")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });

  it("renders a visually-hidden textual summary with values", () => {
    renderWithIntl(
      <PlatformPerformance
        title="Revenue"
        data={data}
        formatValue={(value) => `$${value}`}
      />,
    );
    expect(screen.getByText(/Jan: \$1000/)).toBeInTheDocument();
  });

  it("renders the optional badge and title", () => {
    renderWithIntl(
      <PlatformPerformance title="Revenue" data={data} badgeLabel="2024" />,
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });
});
