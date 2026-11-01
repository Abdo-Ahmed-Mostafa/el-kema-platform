import { test, expect } from "@playwright/test";

// Cold dev-server compiles the target route on first hit; give navigations
// headroom so first-visit compile time doesn't flake the suite.
test.describe.configure({ timeout: 60_000 });

test.describe("locale routing", () => {
  test("/ redirects to a locale-prefixed path", async ({ page }) => {
    // next-intl negotiates the locale from Accept-Language, so the exact
    // locale depends on the browser. Assert only that a locale prefix is added.
    await page.goto("/");
    await expect(page).toHaveURL(/\/(ar|en)$/);
  });

  test("/ar renders RTL Arabic", async ({ page }) => {
    await page.goto("/ar");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/en renders LTR English", async ({ page }) => {
    await page.goto("/en");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
    await expect(html).toHaveAttribute("dir", "ltr");
  });
});

test.describe("public navigation", () => {
  test("home shows a hero heading", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("courses list renders a heading", async ({ page }) => {
    await page.goto("/en/courses");
    await expect(
      page.getByRole("heading", { name: /courses/i, level: 1 }),
    ).toBeVisible();
  });

  test("a course detail page renders its title", async ({ page }) => {
    await page.goto("/en/courses/intro-to-chemistry");
    await expect(
      page.getByRole("heading", { name: /introduction to chemistry/i }),
    ).toBeVisible();
  });
});

test.describe("auth guard", () => {
  test("unauthenticated dashboard access redirects to login", async ({
    page,
  }) => {
    await page.goto("/en/student");
    await expect(page).toHaveURL(/\/en\/login/);
  });
});
