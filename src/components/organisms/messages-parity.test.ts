import { describe, it, expect } from "vitest";

import en from "../../../messages/en.json";
import ar from "../../../messages/ar.json";

/** Recursively collect every leaf key path from a messages object. */
function keyPaths(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? keyPaths(value as Record<string, unknown>, path)
      : [path];
  });
}

describe("messages organisms parity", () => {
  it("has identical organisms key sets in en and ar", () => {
    const enKeys = keyPaths(en.organisms as Record<string, unknown>).sort();
    const arKeys = keyPaths(ar.organisms as Record<string, unknown>).sort();
    expect(arKeys).toEqual(enKeys);
  });
});
