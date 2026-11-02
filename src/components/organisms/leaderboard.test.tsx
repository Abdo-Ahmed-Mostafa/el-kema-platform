import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Leaderboard } from "./leaderboard";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Leaderboard", () => {
  it("renders name, school, scores and the i18n score labels", () => {
    renderWithIntl(
      <Leaderboard
        name="Sara Ali"
        school="Cairo High"
        avatarFallback="SA"
        subjectScore={95}
        totalScore={480}
      />,
    );
    expect(
      screen.getByRole("article", { name: "Sara Ali" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cairo High")).toBeInTheDocument();
    expect(screen.getByText("Subject score")).toBeInTheDocument();
    expect(screen.getByText("Total score")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("480")).toBeInTheDocument();
    // Avatar fallback shows the initials.
    expect(screen.getByText("SA")).toBeInTheDocument();
  });

  it("shows the rank badge when rank is provided", () => {
    renderWithIntl(
      <Leaderboard
        name="Omar"
        avatarFallback="O"
        subjectScore={1}
        totalScore={2}
        rank={1}
        medal
      />,
    );
    expect(screen.getByText("Rank 1")).toBeInTheDocument();
  });
});
