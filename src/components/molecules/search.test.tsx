import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { SearchBar, SearchButton } from "./search";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("SearchBar", () => {
  it("renders a searchbox with the i18n placeholder", () => {
    renderWithIntl(<SearchBar />);
    const box = screen.getByRole("searchbox");
    expect(box).toHaveAttribute("placeholder", "Search");
  });

  it("accepts a custom placeholder override", () => {
    renderWithIntl(<SearchBar placeholder="Find courses" />);
    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "placeholder",
      "Find courses",
    );
  });
});

describe("SearchButton", () => {
  it("exposes the search aria-label", () => {
    renderWithIntl(<SearchButton />);
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});
