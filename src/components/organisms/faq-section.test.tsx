import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { FaqSection } from "./faq-section";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const items = [
  { value: "a", question: "Question A", answer: "Answer A" },
  { value: "b", question: "Question B", answer: "Answer B" },
];

describe("FaqSection", () => {
  it("renders an i18n-labelled section with every accordion item", () => {
    renderWithIntl(<FaqSection items={items} />);
    const section = screen.getByRole("region", {
      name: "Frequently asked questions",
    });
    expect(section).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Question A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Question B" }),
    ).toBeInTheDocument();
  });

  it("toggles an item open via keyboard through the composed Accordion", async () => {
    const user = userEvent.setup();
    renderWithIntl(<FaqSection items={items} />);
    const trigger = screen.getByRole("button", { name: "Question A" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
