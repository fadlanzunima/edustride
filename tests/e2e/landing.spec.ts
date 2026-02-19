import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/EduStride/);
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    const loginButton = page.getByRole("link", { name: /login|masuk/i });
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should have level switcher", async ({ page }) => {
    await page.goto("/");
    const levelSwitcher = page.getByText(/SMA|S1|S2\/S3/);
    await expect(levelSwitcher.first()).toBeVisible();
  });

  test("should display features section", async ({ page }) => {
    await page.goto("/");
    const featuresHeading = page.getByRole("heading", {
      name: /features|fitur/i,
    });
    await expect(featuresHeading.first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should navigate to about page", async ({ page }) => {
    await page.goto("/");
    const aboutLink = page.getByRole("link", { name: /about|tentang/i });
    await aboutLink.click();
    await expect(page).toHaveURL(/.*about/);
  });
});
