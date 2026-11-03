import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Carousel } from "./carousel";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const items = ["First", "Second", "Third"];

function renderCarousel(
  props?: Partial<React.ComponentProps<typeof Carousel>>,
) {
  return renderWithIntl(
    <Carousel label="Demo carousel" {...props}>
      {items.map((label) => (
        <div key={label}>{label}</div>
      ))}
    </Carousel>,
  );
}

beforeEach(() => {
  // jsdom does not implement scrollBy; stub it so the click handler can run.
  Element.prototype.scrollBy = vi.fn();
  // jsdom reports 0 for every layout metric, which would make the track look
  // both at-start and at-end. Simulate an overflowing track still scrolled to
  // the start so the edge logic behaves like a real browser.
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1200);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600);
});

describe("Carousel", () => {
  it("renders all item children", () => {
    renderCarousel();
    for (const label of items) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders prev and next buttons with aria-labels", () => {
    renderCarousel();
    expect(
      screen.getByRole("button", { name: "Previous" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("labels the scroll region as a group", () => {
    renderCarousel();
    expect(
      screen.getByRole("group", { name: "Demo carousel" }),
    ).toBeInTheDocument();
  });

  it("disables prev at the start and leaves next enabled", () => {
    renderCarousel();
    // jsdom has no layout, so scroll position stays at the logical start.
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("scrolls when next is clicked", async () => {
    const user = userEvent.setup();
    renderCarousel();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
  });
});
