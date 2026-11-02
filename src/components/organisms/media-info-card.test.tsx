import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../messages/en.json";
import { MediaInfoCard } from "./media-info-card";
import { StopwatchIcon, PersonIcon } from "@/components/icons";

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const baseProps = {
  imageSrc: "/home/course-1.png",
  imageAlt: "Course cover",
  title: "Chemistry 101",
  subtitle: "Dr. Mohamed",
  meta: [
    { icon: <StopwatchIcon aria-hidden />, label: "45 minutes" },
    { icon: <PersonIcon aria-hidden />, label: "+50 students" },
  ],
  ctaLabel: "Book now",
};

describe("MediaInfoCard", () => {
  it("renders title, subtitle, meta labels and CTA", () => {
    renderWithIntl(<MediaInfoCard {...baseProps} />);
    expect(screen.getByText("Chemistry 101")).toBeInTheDocument();
    expect(screen.getByText("Dr. Mohamed")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
    expect(screen.getByText("+50 students")).toBeInTheDocument();
    expect(screen.getByText("Book now")).toBeInTheDocument();
    expect(screen.getByAltText("Course cover")).toBeInTheDocument();
  });

  it("renders the rating badge only when rating is set", () => {
    const { rerender } = renderWithIntl(<MediaInfoCard {...baseProps} />);
    expect(screen.queryByText("4.5")).not.toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <MediaInfoCard {...baseProps} rating="4.5" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders the price row only when price is provided", () => {
    const { rerender } = renderWithIntl(<MediaInfoCard {...baseProps} />);
    expect(screen.queryByText("500 EGP")).not.toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <MediaInfoCard
          {...baseProps}
          price={{
            current: "500 EGP",
            old: "1200 EGP",
            discountLabel: "45% off",
          }}
        />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("500 EGP")).toBeInTheDocument();
    expect(screen.getByText("1200 EGP")).toBeInTheDocument();
    expect(screen.getByText("45% off")).toBeInTheDocument();
  });

  it("renders a link when href is provided", () => {
    renderWithIntl(<MediaInfoCard {...baseProps} href="/courses/1" />);
    expect(screen.getByRole("link", { name: "Book now" })).toHaveAttribute(
      "href",
      "/courses/1",
    );
  });
});
