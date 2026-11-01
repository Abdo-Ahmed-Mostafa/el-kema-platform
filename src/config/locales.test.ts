import { describe, it, expect } from "vitest";

import { isLocale, getDirection, defaultLocale } from "./locales";

describe("locales", () => {
  it("defaults to Arabic", () => {
    expect(defaultLocale).toBe("ar");
  });

  it("narrows valid locales", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("resolves direction per locale", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("falls back to ltr for unknown locales", () => {
    expect(getDirection("xx")).toBe("ltr");
  });
});
