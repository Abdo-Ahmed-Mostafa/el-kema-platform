import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonGroup } from "./button-group";

const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

describe("ButtonGroup", () => {
  it("marks the active item with aria-pressed", () => {
    render(<ButtonGroup items={items} value="week" />);
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("fires onValueChange when an item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ButtonGroup items={items} value="day" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Month" }));
    expect(onValueChange).toHaveBeenCalledWith("month");
  });

  it("renders a group role", () => {
    render(<ButtonGroup items={items} value="day" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
