import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import {
  SearchIcon,
  GraduationIcon,
  GoogleIcon,
  MastercardIcon,
  LogoMark,
} from "./index";

describe("icon module", () => {
  it("re-exports lucide glyphs under Figma-aligned names", () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // lucide glyphs inherit color via currentColor on the stroke.
    expect(svg).toHaveAttribute("stroke", "currentColor");
  });

  it("forwards size and className to lucide glyphs", () => {
    const { container } = render(
      <GraduationIcon size={32} className="text-primary" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveClass("text-primary");
  });

  it("renders brand marks with their own colors (not currentColor)", () => {
    const { container } = render(<MastercardIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    // Brand fills are baked in, not inherited.
    expect(container.innerHTML).toContain("#EB001B");
  });

  it("hides decorative brand marks from assistive tech by default", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("exposes a brand mark as an image when a title is provided", () => {
    const { container, getByTitle } = render(<GoogleIcon title="Google" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Google");
    expect(getByTitle("Google")).toBeInTheDocument();
  });

  it("keeps the logo mark aspect ratio when sized by height", () => {
    const { container } = render(<LogoMark size={163} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "163");
    expect(svg).toHaveAttribute("width", "159");
  });
});
