import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Accordion, AccordionItem } from "./accordion";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Accordion", () => {
  it("starts collapsed with aria-expanded=false and a hidden panel", () => {
    renderWithIntl(
      <Accordion>
        <AccordionItem value="a" title="Question A">
          Answer A
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Question A" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Answer A")).not.toBeVisible();
  });

  it("toggles aria-expanded and reveals the panel on click", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Accordion>
        <AccordionItem value="a" title="Question A">
          Answer A
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Answer A")).toBeVisible();
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-labelledby",
      trigger.id,
    );
  });

  it("toggles via the Enter key (native button)", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Accordion>
        <AccordionItem value="a" title="Question A">
          Answer A
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps a single item open in type=single", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Accordion type="single">
        <AccordionItem value="a" title="Question A">
          Answer A
        </AccordionItem>
        <AccordionItem value="b" title="Question B">
          Answer B
        </AccordionItem>
      </Accordion>,
    );
    const [triggerA, triggerB] = screen.getAllByRole("button");
    await user.click(triggerA);
    await user.click(triggerB);
    expect(triggerA).toHaveAttribute("aria-expanded", "false");
    expect(triggerB).toHaveAttribute("aria-expanded", "true");
  });
});
