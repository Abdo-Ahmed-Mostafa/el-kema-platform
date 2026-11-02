import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Filter, FilterGroup } from "./filter";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const options = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

describe("Filter", () => {
  it("reflects the selected state via aria-pressed", () => {
    renderWithIntl(<Filter selected>Active</Filter>);
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("FilterGroup", () => {
  it("renders a labelled group of chips", () => {
    renderWithIntl(<FilterGroup label="Status" options={options} />);
    const group = screen.getByRole("group", { name: "Status" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });

  it("fires onValueChange when a chip is selected (single select)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(
      <FilterGroup
        label="Status"
        options={options}
        value=""
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(onValueChange).toHaveBeenCalledWith("active");
  });

  it("toggles the selected value off when clicked again", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(
      <FilterGroup
        label="Status"
        options={options}
        value="active"
        onValueChange={onValueChange}
      />,
    );
    const active = screen.getByRole("button", { name: "Active" });
    expect(active).toHaveAttribute("aria-pressed", "true");
    await user.click(active);
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("accumulates values in multi-select mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderWithIntl(
      <FilterGroup
        label="Status"
        multiple
        options={options}
        value={["all"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(onValueChange).toHaveBeenCalledWith(["all", "active"]);
  });
});
