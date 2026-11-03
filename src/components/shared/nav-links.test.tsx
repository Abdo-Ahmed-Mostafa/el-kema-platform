import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the locale-aware navigation module so the Client Component renders
// without the full next-intl provider: `Link` becomes a plain anchor and
// `usePathname` returns a controllable value.
const mockPathname = vi.fn<() => string>();
vi.mock("@/lib/i18n/navigation", () => ({
  usePathname: () => mockPathname(),
  Link: ({
    href,
    children,
    ...props
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { NavLinks } from "./nav-links";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
];

describe("NavLinks", () => {
  it("marks the active route with aria-current and the navy active-underline classes", () => {
    mockPathname.mockReturnValue("/courses");
    render(<NavLinks links={links} />);

    const active = screen.getByRole("link", { name: "Courses" });
    expect(active).toHaveAttribute("aria-current", "page");
    // Figma Pressed/active: navy label + navy 2px bottom border.
    expect(active.className).toContain("aria-[current=page]:text-primary");
    expect(active.className).toContain("aria-[current=page]:border-primary");

    const inactive = screen.getByRole("link", { name: "Home" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("applies the teal hover-underline classes and a reserved transparent border", () => {
    mockPathname.mockReturnValue("/");
    render(<NavLinks links={links} />);

    const link = screen.getByRole("link", { name: "Courses" });
    // Figma Hover: teal (#14b8a6 = secondary) label + teal 2px bottom border.
    expect(link.className).toContain("hover:text-secondary");
    expect(link.className).toContain("hover:border-secondary");
    // Default reserves a 2px transparent border so hover/active don't shift layout.
    expect(link.className).toContain("border-b-2");
    expect(link.className).toContain("border-transparent");
  });

  it("matches the home link only on an exact path, not as a prefix", () => {
    mockPathname.mockReturnValue("/courses");
    render(<NavLinks links={links} />);

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
