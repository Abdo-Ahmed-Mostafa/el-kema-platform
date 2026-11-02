import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Pagination } from "./pagination";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Pagination", () => {
  it("marks the current page with aria-current", () => {
    renderWithIntl(<Pagination page={2} pageCount={3} />);
    const current = screen.getByRole("button", { name: "Page 2" });
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("fires onPageChange when a page is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination page={1} pageCount={3} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("fires onPageChange from the Next control", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination page={1} pageCount={3} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables Previous on the first page", () => {
    renderWithIntl(<Pagination page={1} pageCount={3} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("renders every page when the count is small (no ellipsis)", () => {
    renderWithIntl(<Pagination page={1} pageCount={5} />);
    expect(
      document.querySelectorAll('[data-slot="pagination-item"]'),
    ).toHaveLength(5);
    expect(
      document.querySelector('[data-slot="pagination-ellipsis"]'),
    ).toBeNull();
  });

  it("collapses large page counts behind ellipses but keeps the ends", () => {
    renderWithIntl(<Pagination page={10} pageCount={50} />);
    // First and last page remain reachable.
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 50" })).toBeInTheDocument();
    // Both leading and trailing ellipses are present.
    expect(
      document.querySelectorAll('[data-slot="pagination-ellipsis"]').length,
    ).toBe(2);
    // The window around the current page is shown.
    expect(screen.getByRole("button", { name: "Page 10" })).toBeInTheDocument();
  });
});
