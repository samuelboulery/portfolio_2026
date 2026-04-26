import { expect, test } from "@playwright/test";

async function skipBootScreen(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("boot-done", "1");
  });
}

test.describe("OSBar", () => {
  test.describe("Special menu", () => {
    test("Shut Down affiche le ShutdownScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Shut Down" }).click();

      await expect(page.getByTestId("shutdown-screen")).toBeVisible();
    });

    test("ShutdownScreen → clic relance le BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Shut Down" }).click();
      await expect(page.getByTestId("shutdown-screen")).toBeVisible();

      await page.getByTestId("shutdown-screen").click();
      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });

    test("Restart relance le BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Restart" }).click();

      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });
  });

  test.describe("Apple menu", () => {
    test("CommandShell ouvre la fenêtre terminal", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Menu Apple" }).click();
      await page.getByRole("menuitem", { name: "CommandShell" }).click();

      // La fenêtre terminal s'ouvre — vérifie via le titre dans la title bar
      await expect(page.getByText("CommandShell 1", { exact: false }).first()).toBeVisible();
    });
  });

  test.describe("Thème Lisa", () => {
    test("data-theme='lisa' est appliqué sur <html>", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("data-theme", "lisa");
    });
  });
});
