import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tag } from "./tags";

describe("Tag", () => {
  it("renders its label", () => {
    render(<Tag>Design</Tag>);
    expect(screen.getByRole("button", { name: "Design" })).toBeInTheDocument();
  });

  it("reflects the selected state via aria-pressed and data-state", () => {
    render(<Tag selected>Selected</Tag>);
    const tag = screen.getByRole("button", { name: "Selected" });
    expect(tag).toHaveAttribute("aria-pressed", "true");
    expect(tag).toHaveAttribute("data-state", "selected");
  });

  it("fires onRemove when the close affordance is activated", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove design">
        Design
      </Tag>,
    );
    await user.click(screen.getByRole("button", { name: "Remove design" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("applies the disabled attribute", () => {
    render(<Tag disabled>Nope</Tag>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});
