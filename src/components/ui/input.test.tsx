import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Input } from "./input";

describe("Input", () => {
  it("defaults to the Default state", () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("data-state", "default");
    expect(input).toHaveClass("bg-muted");
  });

  it("renders the Figma Filled state (accent surface, inverse text)", () => {
    render(<Input filled aria-label="Name" />);
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("data-state", "filled");
    // #5688b8 -> --input-filled accent surface, #fafafa -> primary-foreground text.
    expect(input).toHaveClass("bg-input-filled");
    expect(input).toHaveClass("text-primary-foreground");
  });

  it("marks aria-invalid when error is set", () => {
    render(<Input error aria-label="Code" />);
    expect(screen.getByLabelText("Code")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
