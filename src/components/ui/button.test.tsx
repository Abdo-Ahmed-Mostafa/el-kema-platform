import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "./button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("applies the disabled attribute", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders a destructive outline variant", () => {
    render(
      <Button variant="destructive" appearance="outline">
        Delete
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders a large size", () => {
    render(<Button size="lg">Big</Button>);
    expect(screen.getByRole("button", { name: "Big" })).toBeInTheDocument();
  });

  it("uses the exact Figma inverse tones (primary-light / -light-strong)", () => {
    const { rerender } = render(
      <Button variant="inverse" appearance="outline">
        Inv
      </Button>,
    );
    let btn = screen.getByRole("button", { name: "Inv" });
    expect(btn).toHaveClass("hover:bg-primary-light");
    expect(btn).toHaveClass("active:bg-primary-light-strong");

    rerender(
      <Button variant="inverse" appearance="ghost">
        Inv
      </Button>,
    );
    btn = screen.getByRole("button", { name: "Inv" });
    expect(btn).toHaveClass("hover:bg-primary-light");
    expect(btn).toHaveClass("active:bg-primary-light-strong");
  });
});
