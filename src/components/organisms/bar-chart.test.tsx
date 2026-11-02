import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { BarChart } from "./bar-chart";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const data = [
  { label: "A", value: 50 },
  { label: "B", value: 100 },
  { label: "C", value: 25 },
];

describe("BarChart", () => {
  it("renders one column per datum with its label", () => {
    renderWithIntl(<BarChart data={data} />);
    expect(
      document.querySelectorAll('[data-slot="bar-chart-column"]'),
    ).toHaveLength(3);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("scales bar heights against max and clamps to 0..100%", () => {
    renderWithIntl(<BarChart data={data} max={100} />);
    const bars = document.querySelectorAll('[data-slot="bar-chart-bar"]');
    expect((bars[0] as HTMLElement).style.height).toBe("50%");
    expect((bars[1] as HTMLElement).style.height).toBe("100%");
    expect((bars[2] as HTMLElement).style.height).toBe("25%");
  });

  it("clamps values above max to 100%", () => {
    renderWithIntl(<BarChart data={[{ label: "X", value: 200 }]} max={100} />);
    const bar = document.querySelector('[data-slot="bar-chart-bar"]');
    expect((bar as HTMLElement).style.height).toBe("100%");
  });

  it("exposes an img role with an aria-label", () => {
    renderWithIntl(<BarChart data={data} title="Scores" />);
    expect(screen.getByRole("img")).toHaveAccessibleName(/Scores/);
  });

  it("applies a per-bar color when provided", () => {
    renderWithIntl(
      <BarChart data={[{ label: "X", value: 10, color: "#ff0000" }]} />,
    );
    const bar = document.querySelector(
      '[data-slot="bar-chart-bar"]',
    ) as HTMLElement;
    expect(bar.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });
});
