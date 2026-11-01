import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders a light tone variant", () => {
    render(
      <Badge variant="warning" tone="light">
        Pending
      </Badge>,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Badge asChild>
        <a href="https://example.com">Link</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
