import { describe, it, expect } from "vitest";

import { cacheTags } from "./cache-tags";

describe("cacheTags", () => {
  it("exposes static collection tags", () => {
    expect(cacheTags.courses).toBe("courses");
    expect(cacheTags.teachers).toBe("teachers");
  });

  it("builds entity tags from an id/slug", () => {
    expect(cacheTags.course("intro-to-chemistry")).toBe(
      "course:intro-to-chemistry",
    );
    expect(cacheTags.teacher("sara-hassan")).toBe("teacher:sara-hassan");
  });
});
