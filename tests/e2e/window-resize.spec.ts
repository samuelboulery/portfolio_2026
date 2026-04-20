import { expect, test } from "@playwright/test";

const STORAGE_KEY = "portfolio_2026:windows";

test.describe("Redimensionnement des fenêtres par les bords", () => {
  test("drag sur le bord droit de MainWindow agrandit sa largeur", async ({
    browserName,
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-safari",
      "Redimensionnement désactivé sur variant mobile.",
    );
    test.skip(browserName !== "chromium", "Resize e2e limité à chromium.");

    await page.goto("/");

    const main = page
      .locator('[data-variant="desktop"][data-focused]')
      .filter({ hasText: "System Designer" })
      .first();
    await expect(main).toBeVisible();

    await main.click({ position: { x: 200, y: 8 } });
    await page.waitForTimeout(150);

    const before = await main.boundingBox();
    if (!before) throw new Error("Bounding box initiale introuvable.");

    const startX = before.x + before.width - 1;
    const startY = before.y + before.height / 2;
    const dx = 140;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx / 2, startY, { steps: 6 });
    await page.mouse.move(startX + dx, startY, { steps: 6 });
    await page.mouse.up();

    await expect
      .poll(async () => {
        const box = await main.boundingBox();
        if (!box) return 0;
        return box.width;
      })
      .toBeGreaterThan(before.width + dx - 6);
  });

  test("la taille persiste après reload", async ({ browserName, page }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-safari",
      "Redimensionnement désactivé sur variant mobile.",
    );
    test.skip(browserName !== "chromium", "Resize e2e limité à chromium.");

    await page.goto("/");

    const main = page
      .locator('[data-variant="desktop"][data-focused]')
      .filter({ hasText: "System Designer" })
      .first();
    await expect(main).toBeVisible();

    await main.click({ position: { x: 200, y: 8 } });
    await page.waitForTimeout(150);

    const before = await main.boundingBox();
    if (!before) throw new Error("Bounding box initiale introuvable.");

    const startX = before.x + before.width - 1;
    const startY = before.y + before.height / 2;
    const dx = 120;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx, startY, { steps: 8 });
    await page.mouse.up();

    const getStoredSize = async () =>
      page.evaluate((key: string) => {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw) as {
            state?: {
              windows?: Record<string, { size?: { width: number; height: number } }>;
            };
          };
          return parsed.state?.windows?.main?.size ?? null;
        } catch {
          return null;
        }
      }, STORAGE_KEY);

    await expect.poll(getStoredSize).not.toBeNull();
    const stored = await getStoredSize();
    if (!stored) throw new Error("Taille non persistée.");

    await page.reload();

    await expect
      .poll(async () => {
        const box = await main.boundingBox();
        if (!box) return 0;
        return Math.abs(box.width - stored.width);
      })
      .toBeLessThanOrEqual(4);
  });
});
