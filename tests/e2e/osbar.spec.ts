import { expect, test } from "@playwright/test";

async function skipBootScreen(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("boot-done", "1");
  });
}

test.describe("OSBar", () => {
  test.describe("Special menu", () => {
    test("Shut Down → confirm dialog → ShutdownScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Shut Down" }).click();

      const dialog = page.getByRole("alertdialog", { name: "Shut Down" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Shut Down" }).click();

      await expect(page.getByTestId("shutdown-screen")).toBeVisible();
    });

    test("Shut Down → Cancel ferme le dialog sans éteindre", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Shut Down" }).click();

      const dialog = page.getByRole("alertdialog", { name: "Shut Down" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Cancel" }).click();
      await expect(dialog).not.toBeVisible();
      await expect(page.getByTestId("shutdown-screen")).not.toBeVisible();
    });

    test("ShutdownScreen → clic relance le BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Shut Down" }).click();
      await page
        .getByRole("alertdialog", { name: "Shut Down" })
        .getByRole("button", { name: "Shut Down" })
        .click();
      await expect(page.getByTestId("shutdown-screen")).toBeVisible();

      await page.getByTestId("shutdown-screen").click();
      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });

    test("Restart → confirm → BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Special" }).click();
      await page.getByRole("menuitem", { name: "Restart" }).click();
      await page
        .getByRole("alertdialog", { name: "Restart" })
        .getByRole("button", { name: "Restart" })
        .click();

      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });
  });

  test.describe("Apple menu", () => {
    test("About this Macintosh ouvre l'AboutDialog", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Menu Apple" }).click();
      await page.getByRole("menuitem", { name: /About this Macintosh/ }).click();

      const dialog = page.getByRole("alertdialog", { name: /About this Macintosh/ });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText(/Samuel Boulery/)).toBeVisible();
      await dialog.getByRole("button", { name: "OK" }).click();
      await expect(dialog).not.toBeVisible();
    });

    test("CommandShell ferme le menu Apple après sélection", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Menu Apple" }).click();
      await expect(page.getByRole("menu")).toBeVisible();
      await page.getByRole("menuitem", { name: "CommandShell" }).click();
      await expect(page.getByRole("menu")).not.toBeVisible();
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
