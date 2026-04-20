import { expect, test } from "@playwright/test";

test.describe("Terminal — saisie clavier", () => {
  test("taper `edf` + Enter ouvre la fenêtre projet EDF", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();
    await input.fill("edf");
    await input.press("Enter");
    const projectHeader = page.locator("header").filter({ hasText: "Design System EDF" });
    await expect(projectHeader.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("taper `xyz` + Enter affiche `command not found`", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();
    await input.fill("xyz");
    await input.press("Enter");
    await expect(page.getByText("command not found: xyz")).toBeVisible();
  });

  test("taper `clear` + Enter efface les sorties", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();

    await input.fill("xyz");
    await input.press("Enter");
    await expect(page.getByText("command not found: xyz")).toBeVisible();

    await input.fill("clear");
    await input.press("Enter");
    await expect(page.getByText("command not found: xyz")).toHaveCount(0);
  });

  test("`cd ` + Tab cycle entre projects, links, about avec wrap", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();

    await input.fill("cd ~");
    await input.press("Enter");

    await input.fill("cd ");
    await input.press("Tab");
    await expect(input).toHaveValue("cd projects/");

    await input.press("Tab");
    await expect(input).toHaveValue("cd links/");

    await input.press("Tab");
    await expect(input).toHaveValue("cd about/");

    await input.press("Tab");
    await expect(input).toHaveValue("cd projects/");

    await input.press("Shift+Tab");
    await expect(input).toHaveValue("cd about/");
  });

  test("`matrix` déclenche une animation puis rend le prompt disponible", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();

    await input.fill("matrix");
    await input.press("Enter");

    await page.waitForTimeout(3500);

    await input.fill("echo ok");
    await input.press("Enter");
    await expect(page.getByText("ok", { exact: true })).toBeVisible();
  });

  test("`exit` ferme la fenêtre terminal", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("terminal command");
    await input.click();
    await expect(input).toBeVisible();

    await input.fill("exit");
    await input.press("Enter");

    await expect(input).toHaveCount(0, { timeout: 2000 });
  });
});
