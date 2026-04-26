import { expect, test } from "@playwright/test";

async function skipBootScreen(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("boot-done", "1");
  });
}

test.describe("OSBar", () => {
  test.describe("Power Menu", () => {
    test("Éteindre affiche le ShutdownScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Menu système" }).click();
      await page.getByRole("menuitem", { name: "Éteindre" }).click();

      await expect(page.getByTestId("shutdown-screen")).toBeVisible();
    });

    test("ShutdownScreen → clic relance le BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Menu système" }).click();
      await page.getByRole("menuitem", { name: "Éteindre" }).click();
      await expect(page.getByTestId("shutdown-screen")).toBeVisible();

      await page.getByTestId("shutdown-screen").click();
      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });

    test("Redémarrer relance le BootScreen", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");

      await page.getByRole("button", { name: "Menu système" }).click();
      await page.getByRole("menuitem", { name: "Redémarrer" }).click();

      await expect(page.getByTestId("boot-screen")).toBeVisible();
    });
  });

  test.describe("Navigation Fichier", () => {
    test("Fichier > CV ouvre la CVWindow", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Fichier" }).click();
      await page.getByRole("menuitem", { name: "CV" }).click();

      await expect(page.getByRole("heading", { name: "Curriculum vitae", level: 1 })).toBeVisible();
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

    test("Le sous-menu Vue n'expose plus de sélecteur de thème", async ({ page }) => {
      await skipBootScreen(page);
      await page.goto("/");
      await expect(page.getByTestId("boot-screen")).not.toBeVisible();

      await page.getByRole("button", { name: "Vue" }).click();
      await expect(page.getByRole("menuitem", { name: /Thème/i })).toHaveCount(0);
    });
  });
});
