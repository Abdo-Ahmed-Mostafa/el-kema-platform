import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { PasswordToggle } from "./password-toggle";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("PasswordToggle", () => {
  it("exposes the show label and aria-pressed=false when hidden", () => {
    renderWithIntl(<PasswordToggle visible={false} onToggle={() => {}} />);
    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("flips aria-pressed and the label when visible", () => {
    renderWithIntl(<PasswordToggle visible onToggle={() => {}} />);
    const button = screen.getByRole("button", { name: "Hide password" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderWithIntl(<PasswordToggle visible={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
