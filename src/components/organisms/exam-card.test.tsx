import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { ExamCard } from "./exam-card";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("ExamCard", () => {
  it("renders a labelled article with name, grade and info chips", () => {
    renderWithIntl(
      <ExamCard
        examName="Midterm"
        gradeLevel="Grade 10"
        questions="20"
        duration="60m"
        date="2024-05-01"
      />,
    );
    expect(
      screen.getByRole("article", { name: "Midterm" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Grade 10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("60m")).toBeInTheDocument();
    expect(screen.getByText("2024-05-01")).toBeInTheDocument();
  });

  it("falls back to the i18n CTA label", () => {
    renderWithIntl(<ExamCard examName="Midterm" />);
    expect(
      screen.getByRole("button", { name: "Activate exam" }),
    ).toBeInTheDocument();
  });

  it("fires onCtaClick in button mode", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    renderWithIntl(
      <ExamCard examName="Midterm" ctaLabel="Start" onCtaClick={onCtaClick} />,
    );
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });
});
