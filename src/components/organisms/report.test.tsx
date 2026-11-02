import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { Report, ReportRow } from "./report";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("Report", () => {
  it("renders a semantic table", () => {
    renderWithIntl(
      <Report variant="course">
        <ReportRow variant="course" name="Algebra" />
      </Report>,
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders the course variant column headers from i18n", () => {
    renderWithIntl(
      <Report variant="course">
        <ReportRow variant="course" name="Algebra" />
      </Report>,
    );
    const headers = screen
      .getAllByRole("columnheader")
      .map((h) => h.textContent);
    expect(headers).toEqual([
      "Name",
      "Date",
      "Students",
      "Amount",
      "Details",
      "Actions",
    ]);
  });

  it("renders the exam variant column headers from i18n", () => {
    renderWithIntl(
      <Report variant="exam">
        <ReportRow variant="exam" name="Quiz 1" />
      </Report>,
    );
    const headers = screen
      .getAllByRole("columnheader")
      .map((h) => h.textContent);
    expect(headers).toEqual(["Name", "Exam no.", "Mark", "Status", "Actions"]);
  });

  it("renders a course row's cells", () => {
    renderWithIntl(
      <Report variant="course">
        <ReportRow
          variant="course"
          name="Algebra"
          date="2024-01-01"
          students="120"
          amount="$500"
          details="View"
        />
      </Report>,
    );
    const row = screen.getByRole("row", { name: /Algebra/ });
    expect(within(row).getByText("2024-01-01")).toBeInTheDocument();
    expect(within(row).getByText("120")).toBeInTheDocument();
    expect(within(row).getByText("$500")).toBeInTheDocument();
  });

  it("renders a pass/fail badge for the exam variant", () => {
    renderWithIntl(
      <Report variant="exam">
        <ReportRow
          variant="exam"
          name="Quiz 1"
          examNumber="01"
          mark="88"
          passed={false}
        />
      </Report>,
    );
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("renders labelled action buttons and fires their handlers", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const onDelete = vi.fn();
    renderWithIntl(
      <Report variant="course">
        <ReportRow
          variant="course"
          name="Algebra"
          actions={{ view: true, delete: true, onView, onDelete }}
        />
      </Report>,
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onView).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
