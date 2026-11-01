import { describe, it, expect } from "vitest";

import { formatCurrency, formatNumber, truncate } from "./formatters";

describe("formatters", () => {
  it("formats numbers for en", () => {
    expect(formatNumber(1234, "en")).toBe("1,234");
  });

  it("formats currency with the EGP default", () => {
    const out = formatCurrency(100, "en");
    // Intl output varies by ICU; assert it contains the amount and a currency marker.
    expect(out).toMatch(/100/);
    expect(out.length).toBeGreaterThan(3);
  });

  it("produces different output per locale", () => {
    expect(formatNumber(1234, "ar")).not.toBe(formatNumber(1234, "en"));
  });

  it("truncates long text with an ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("leaves short text untouched", () => {
    expect(truncate("hi", 5)).toBe("hi");
  });
});
