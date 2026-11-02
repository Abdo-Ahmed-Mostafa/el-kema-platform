import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { ProgressRing } from "./progress-ring";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("ProgressRing", () => {
  it("exposes role=progressbar with aria-valuenow/min/max", () => {
    renderWithIntl(<ProgressRing value={25} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "25");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("builds an accessible name from the i18n progress key", () => {
    renderWithIntl(<ProgressRing value={70} />);
    expect(
      screen.getByRole("progressbar", { name: "70% complete" }),
    ).toBeInTheDocument();
  });

  it("clamps out-of-range values", () => {
    renderWithIntl(<ProgressRing value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("renders a decorative aria-hidden spinner element", () => {
    const { container } = renderWithIntl(<ProgressRing value={40} />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
    expect(spinner).toHaveAttribute("aria-hidden");
  });
});
