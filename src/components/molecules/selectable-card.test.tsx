import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SelectableCard, SelectableCardGroup } from "./selectable-card";

const groupOptions = [
  { value: "monthly", heading: "Monthly" },
  { value: "yearly", heading: "Yearly" },
  { value: "lifetime", heading: "Lifetime" },
];

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

describe("SelectableCardGroup", () => {
  it("renders a radiogroup owner with radio-card children", () => {
    render(
      <SelectableCardGroup
        label="Plan"
        options={groupOptions}
        value="monthly"
      />,
    );
    expect(
      screen.getByRole("radiogroup", { name: "Plan" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: /Monthly/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("exposes a single roving tabstop on the selected card", () => {
    render(
      <SelectableCardGroup
        label="Plan"
        options={groupOptions}
        value="yearly"
      />,
    );
    expect(screen.getByRole("radio", { name: /Monthly/ })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radio", { name: /Yearly/ })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("moves selection with ArrowRight (roving focus)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectableCardGroup
        label="Plan"
        options={groupOptions}
        value="monthly"
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole("radio", { name: /Monthly/ }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith("yearly");
  });

  it("selects on click via onSelectedChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectableCardGroup
        label="Plan"
        options={groupOptions}
        value="monthly"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("radio", { name: /Lifetime/ }));
    expect(onValueChange).toHaveBeenCalledWith("lifetime");
  });
});
