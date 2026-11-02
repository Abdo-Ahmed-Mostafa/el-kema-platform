import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SelectableCard } from "./selectable-card";

describe("SelectableCard", () => {
  it("reflects the selected state via aria-checked and data-state", () => {
    render(<SelectableCard selected heading="Plan" />);
    const card = screen.getByRole("radio", { name: /Plan/ });
    expect(card).toHaveAttribute("aria-checked", "true");
    expect(card).toHaveAttribute("data-state", "checked");
  });

  it("toggles on Enter", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <SelectableCard heading="Plan" onSelectedChange={onSelectedChange} />,
    );
    const card = screen.getByRole("radio", { name: /Plan/ });
    card.focus();
    await user.keyboard("{Enter}");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("toggles on Space", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <SelectableCard
        selected
        heading="Plan"
        onSelectedChange={onSelectedChange}
      />,
    );
    const card = screen.getByRole("radio", { name: /Plan/ });
    card.focus();
    await user.keyboard(" ");
    expect(onSelectedChange).toHaveBeenCalledWith(false);
  });

  it("supports the checkbox role", () => {
    render(<SelectableCard role="checkbox" heading="Agree" />);
    expect(screen.getByRole("checkbox", { name: /Agree/ })).toBeInTheDocument();
  });
});
