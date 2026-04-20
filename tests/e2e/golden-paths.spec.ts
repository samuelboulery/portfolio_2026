import { expect, test } from "@playwright/test";

const STORAGE_KEY = "portfolio_2026:windows";

test.describe("Parcours golden", () => {
  test("le terminal ouvre le CV via curriculum_vitae.html", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir curriculum_vitae.html" }).click();
    await expect(page.getByRole("heading", { name: "Curriculum vitae", level: 1 })).toBeVisible();
  });

  test("le dossier EDF ouvre la fenêtre projet avec ses tags", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le projet EDF" }).click();
    const projectHeader = page.locator("header").filter({ hasText: "Design System EDF" });
    await expect(projectHeader.getByRole("heading", { level: 1 })).toBeVisible();
    const tags = page.getByLabel("Tags");
    await expect(tags).toBeVisible();
    await expect(tags.getByText("Design System", { exact: true })).toBeVisible();
    await expect(tags.getByText("Tokens", { exact: true })).toBeVisible();
    await expect(tags.getByText("Figma", { exact: true })).toBeVisible();
    await expect(tags.getByText("Governance", { exact: true })).toBeVisible();
  });

  test("la position de MainWindow persiste après reload", async ({
    browserName,
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-safari",
      "Drag désactivé sur variant mobile (tablet-and-below).",
    );
    test.skip(browserName !== "chromium", "Drag e2e limité à chromium.");

    await page.goto("/");

    const mainBar = page.locator('[data-draggable="true"]').filter({ hasText: "System Designer" });
    await expect(mainBar).toBeVisible();

    const getMainPosition = async () => {
      return page.evaluate((key: string) => {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw) as {
            state?: { windows?: Record<string, { position?: { x: number; y: number } }> };
          };
          return parsed.state?.windows?.main?.position ?? null;
        } catch {
          return null;
        }
      }, STORAGE_KEY);
    };

    await expect.poll(getMainPosition).not.toBeNull();
    const initial = await getMainPosition();
    if (!initial) throw new Error("Position initiale introuvable.");

    const box = await mainBar.boundingBox();
    if (!box) throw new Error("Bounding box indisponible.");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const dx = 180;
    const dy = 120;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx / 2, startY + dy / 2, { steps: 8 });
    await page.mouse.move(startX + dx, startY + dy, { steps: 8 });
    await page.mouse.up();

    await expect
      .poll(async () => {
        const pos = await getMainPosition();
        if (!pos) return false;
        return pos.x !== initial.x || pos.y !== initial.y;
      })
      .toBe(true);

    const afterDrag = await getMainPosition();
    if (!afterDrag) throw new Error("Position après drag introuvable.");

    expect(Math.abs(afterDrag.x - (initial.x + dx))).toBeLessThanOrEqual(4);
    expect(Math.abs(afterDrag.y - (initial.y + dy))).toBeLessThanOrEqual(4);

    await page.reload();

    await expect
      .poll(async () => {
        const pos = await getMainPosition();
        if (!pos) return false;
        return pos.x === afterDrag.x && pos.y === afterDrag.y;
      })
      .toBe(true);
  });
});
