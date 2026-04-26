import { expect, test } from "@playwright/test";

async function skipBootScreen(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("boot-done", "1");
  });
}

test.describe("Finder", () => {
  // DesktopDecor (HD + Trash) est masqué en mobile (cf. .module.css media query),
  // donc tout ce qui dépend du double-click HD est skipped sur mobile-safari.

  test("File > Open ouvre le Finder", async ({ page }) => {
    await skipBootScreen(page);
    await page.goto("/");
    await expect(page.getByTestId("boot-screen")).not.toBeVisible();

    await page.getByRole("button", { name: "File" }).click();
    await page.getByRole("menuitem", { name: /Open/ }).click();
    await expect(page.getByText(/items$/i).first()).toBeVisible();
  });

  test("clic projet dans Finder le sélectionne (data-selected)", async ({ page }) => {
    await skipBootScreen(page);
    await page.goto("/");
    await page.getByRole("button", { name: "File" }).click();
    await page.getByRole("menuitem", { name: /Open/ }).click();

    const edf = page.locator('[data-file-id="project:edf"] button');
    await expect(edf).toBeVisible();
    await edf.click();
    await expect(edf).toHaveAttribute("data-selected", "true");
  });

  test("double-clic projet dans Finder ouvre la ProjectWindow", async ({ page }) => {
    await skipBootScreen(page);
    await page.goto("/");
    await page.getByRole("button", { name: "File" }).click();
    await page.getByRole("menuitem", { name: /Open/ }).click();

    await page.locator('[data-file-id="project:edf"] button').dblclick();
    // Le titre "Design System EDF" apparaît dans le header ET dans le contenu MDX (h1 avec id).
    // .first() cible le header (premier dans le DOM).
    await expect(
      page.getByRole("heading", { name: /Design System EDF/i, level: 1 }).first(),
    ).toBeVisible();
  });

  test.describe("Macintosh HD desktop icon", () => {
    test.skip(
      ({ browserName, isMobile }) => isMobile === true || browserName === "webkit",
      "DesktopDecor masqué en mobile",
    );

    test("double-clic Macintosh HD ouvre le Finder", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Macintosh HD" }).first().dblclick();
      await expect(page.getByText(/items$/i).first()).toBeVisible();
    });
  });
});
