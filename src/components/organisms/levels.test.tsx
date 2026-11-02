import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Levels } from "./levels";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Levels", () => {
  it("renders a labelled level with the i18n CTA in the default state", () => {
    renderWithIntl(<Levels level="Level 1" />);
    expect(screen.getByRole("article", { name: "Level 1" })).toHaveAttribute(
      "data-state",
      "default",
    );
    expect(
      screen.getByRole("button", { name: "Start now" }),
    ).toBeInTheDocument();
  });

  it("marks the hover state for inverse styling", () => {
    renderWithIntl(<Levels state="hover" level="Level 2" />);
    expect(screen.getByRole("article", { name: "Level 2" })).toHaveAttribute(
      "data-state",
      "hover",
    );
  });

  it("renders a details slot when provided", () => {
    renderWithIntl(
      <Levels level="Level 3" details={<span>Unlocks advanced topics</span>} />,
    );
    expect(screen.getByText("Unlocks advanced topics")).toBeInTheDocument();
  });
});
