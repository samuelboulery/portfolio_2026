# Boot Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un écran de boot CRT phosphore vert qui s'affiche une fois par session avant le desktop, avec lignes texte humoristiques et transition scan line.

**Architecture:** `BootScreen` est un nouveau composant React (`motion.div` framer-motion) rendu dans `Scene.tsx` enveloppé par `AnimatePresence`. L'état `bootDone` est local à `Scene` (pas de Zustand). Le composant vérifie `sessionStorage` au montage et appelle `onDone()` immédiatement si la session a déjà été vue.

**Tech Stack:** React 19, framer-motion (AnimatePresence, motion, useReducedMotion), CSS Modules, sessionStorage, Vitest + Testing Library (unit), Playwright (e2e).

---

## Fichiers touchés

| Action | Fichier |
|---|---|
| Modifier | `styles/tokens/components.css` |
| Créer | `src/components/os/BootScreen/BootScreen.tsx` |
| Créer | `src/components/os/BootScreen/BootScreen.module.css` |
| Modifier | `src/components/os/Scene.tsx` |
| Créer | `tests/unit/components/BootScreen.test.tsx` |
| Modifier | `tests/e2e/golden-paths.spec.ts` |

---

## Task 1 : Tokens CSS + keyframes

**Files:**
- Modify: `styles/tokens/components.css`

- [ ] **Step 1 : Ajouter les tokens et keyframes boot à la fin de `components.css`**

```css
/* ─── BootScreen ─────────────────────────────────────────── */
--boot-bg: #0a0a0a;
--boot-text: #33ff33;
--boot-text-ok: #33ff33;
--boot-text-cursor: #ffff33;
--boot-duration-line: 400ms;
--boot-duration-exit: 300ms;

@keyframes bootLine {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes bootCursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@keyframes crtOff {
  0%   { transform: scaleY(1); opacity: 1; }
  60%  { transform: scaleY(0.008); opacity: 1; }
  100% { transform: scaleY(0); opacity: 0; }
}
```

- [ ] **Step 2 : Vérifier qu'aucune erreur CSS n'est introduite**

```bash
pnpm typecheck && pnpm lint
```

Résultat attendu : pas d'erreurs.

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: tokens et keyframes boot screen CRT"
```

---

## Task 2 : Tests unitaires BootScreen (TDD — rouge)

**Files:**
- Create: `tests/unit/components/BootScreen.test.tsx`

- [ ] **Step 1 : Créer le fichier de tests**

```tsx
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";

// framer-motion fonctionne en jsdom sans mock — motion.div rend normalement
// mais les animations CSS ne jouent pas. On teste le comportement, pas l'animation.

const LINE_COUNT = 7; // nombre de lignes dans BOOT_LINES
const LINE_DELAY_MS = 400;
const POST_DELAY_MS = 600;
const TOTAL_MS = LINE_COUNT * LINE_DELAY_MS + POST_DELAY_MS;

describe("BootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("appelle onDone après la séquence complète", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    expect(onDone).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(TOTAL_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("écrit sessionStorage après onDone", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    await act(async () => {
      vi.advanceTimersByTime(TOTAL_MS);
    });
    expect(sessionStorage.getItem("boot-done")).toBe("1");
  });

  it("appelle onDone immédiatement si sessionStorage contient boot-done", async () => {
    sessionStorage.setItem("boot-done", "1");
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("appelle onDone sur clic", async () => {
    const onDone = vi.fn();
    const { container } = await act(async () =>
      render(<BootScreen onDone={onDone} />),
    );
    fireEvent.click(container.firstChild as Element);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("appelle onDone sur keydown (n'importe quelle touche)", async () => {
    const onDone = vi.fn();
    await act(async () => {
      render(<BootScreen onDone={onDone} />);
    });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onDone deux fois si clic puis timer", async () => {
    const onDone = vi.fn();
    const { container } = await act(async () =>
      render(<BootScreen onDone={onDone} />),
    );
    fireEvent.click(container.firstChild as Element);
    await act(async () => {
      vi.advanceTimersByTime(TOTAL_MS);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("affiche toutes les lignes de boot", async () => {
    const onDone = vi.fn();
    const { getByText } = await act(async () =>
      render(<BootScreen onDone={onDone} />),
    );
    expect(getByText(/Portfolio OS 2026/)).toBeInTheDocument();
    expect(getByText(/Booting imagination/)).toBeInTheDocument();
    expect(getByText(/Warming up coffee/)).toBeInTheDocument();
    expect(getByText(/Ready/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2 : Exécuter les tests pour confirmer qu'ils échouent (composant absent)**

```bash
pnpm test:run -- tests/unit/components/BootScreen.test.tsx
```

Résultat attendu : `Cannot find module '@/components/os/BootScreen/BootScreen'`

---

## Task 3 : Implémenter BootScreen

**Files:**
- Create: `src/components/os/BootScreen/BootScreen.tsx`
- Create: `src/components/os/BootScreen/BootScreen.module.css`

- [ ] **Step 1 : Créer `BootScreen.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./BootScreen.module.css";

interface BootLine {
  text: string;
  type: "header" | "ok" | "cursor";
}

const BOOT_LINES: BootLine[] = [
  { text: "Portfolio OS 2026 — Samuel Boulery", type: "header" },
  { text: "Booting imagination", type: "ok" },
  { text: "Loading 6 years of experience", type: "ok" },
  { text: "Injecting obsession with details", type: "ok" },
  { text: "Connecting EDF / CBTW instances", type: "ok" },
  { text: "Warming up coffee", type: "ok" },
  { text: "Ready", type: "cursor" },
];

const BOOT_DONE_KEY = "boot-done";
const LINE_DELAY_MS = 400;
const POST_SEQUENCE_DELAY_MS = 600;
const TOTAL_DELAY_MS = BOOT_LINES.length * LINE_DELAY_MS + POST_SEQUENCE_DELAY_MS;

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const doneRef = useRef(false);

  const skip = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem(BOOT_DONE_KEY, "1");
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (sessionStorage.getItem(BOOT_DONE_KEY) || prefersReducedMotion) {
      skip();
      return;
    }

    const timer = setTimeout(skip, TOTAL_DELAY_MS);
    document.addEventListener("keydown", skip);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", skip);
    };
  }, [skip, prefersReducedMotion]);

  return (
    <motion.div
      className={styles.root}
      initial={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
      style={{ transformOrigin: "center" }}
      aria-hidden="true"
      data-testid="boot-screen"
      onClick={skip}
    >
      <div className={styles.terminal}>
        {BOOT_LINES.map((line, index) => (
          <div
            key={line.text}
            className={styles.line}
            style={{ animationDelay: `${index * LINE_DELAY_MS}ms` }}
          >
            {line.type === "header" ? (
              <span className={styles.header}>{line.text}</span>
            ) : (
              <span className={styles.row}>
                <span className={styles.label}>
                  {line.text.padEnd(35, ".")}
                </span>
                {line.type === "cursor" ? (
                  <span className={styles.cursor}>▌</span>
                ) : (
                  <span className={styles.ok}> OK</span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2 : Créer `BootScreen.module.css`**

```css
.root {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: var(--boot-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.terminal {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  line-height: 2;
  color: var(--boot-text);
  min-width: 420px;
}

.line {
  opacity: 0;
  animation: bootLine var(--boot-duration-line) ease forwards;
}

.header {
  color: var(--boot-text);
  font-weight: bold;
  display: block;
  margin-bottom: 0.5em;
}

.row {
  display: flex;
  gap: 0;
  white-space: pre;
}

.label {
  color: var(--boot-text);
}

.ok {
  color: var(--boot-text-ok);
}

.cursor {
  color: var(--boot-text-cursor);
  animation: bootCursor 800ms step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  .line {
    animation: none;
    opacity: 1;
  }
  .cursor {
    animation: none;
  }
}
```

- [ ] **Step 3 : Exécuter les tests unitaires**

```bash
pnpm test:run -- tests/unit/components/BootScreen.test.tsx
```

Résultat attendu : tous les tests passent (7/7).

- [ ] **Step 4 : Vérifier le typage**

```bash
pnpm typecheck
```

Résultat attendu : aucune erreur.

- [ ] **Step 5 : Commit**

```bash
git add src/components/os/BootScreen/ tests/unit/components/BootScreen.test.tsx
git commit -m "feat: composant BootScreen CRT phosphore avec tests"
```

---

## Task 4 : Intégrer BootScreen dans Scene.tsx

**Files:**
- Modify: `src/components/os/Scene.tsx`

- [ ] **Step 1 : Modifier `Scene.tsx`**

Remplacer le contenu actuel de `Scene.tsx` par :

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FoldersGrid } from "@/components/folder/FoldersGrid";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";
import { Desktop } from "@/components/os/Desktop";
import { CVWindow } from "@/components/windows/CVWindow";
import { ImageWindow } from "@/components/windows/ImageWindow";
import { MainWindow } from "@/components/windows/MainWindow";
import { ProjectWindow } from "@/components/windows/ProjectWindow";
import { SubtitleWindow } from "@/components/windows/SubtitleWindow";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { PROJECTS } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./Scene.module.css";

// Opened in order: back → front (last entry = highest z-index)
const BASE_WINDOWS = [
  {
    id: "image",
    type: "image" as const,
    title: "image.ascii",
    initialPosition: { x: 315, y: 73 },
  },
  {
    id: "main",
    type: "main" as const,
    title: "System Designer",
    initialPosition: { x: 83, y: 320 },
  },
  {
    id: "terminal",
    type: "terminal" as const,
    title: "terminal",
    initialPosition: { x: 930, y: 458 },
  },
  {
    id: "subtitle",
    type: "subtitle" as const,
    title: "UX-UI",
    initialPosition: { x: 522, y: 265 },
  },
];

function resolveInitialPositions() {
  if (typeof window === "undefined") return BASE_WINDOWS;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 1920) return BASE_WINDOWS;
  const col1x = Math.round(vw * 0.22);
  const col2x = Math.round(vw * 0.64);
  return [
    { ...BASE_WINDOWS[0], initialPosition: { x: col1x, y: 73 } },
    { ...BASE_WINDOWS[1], initialPosition: { x: Math.round(vw * 0.06), y: Math.round(vh * 0.4) } },
    { ...BASE_WINDOWS[2], initialPosition: { x: col2x, y: Math.round(vh * 0.56) } },
    { ...BASE_WINDOWS[3], initialPosition: { x: col1x + 200, y: Math.round(vh * 0.33) } },
  ];
}

export function Scene() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    const { windows } = useWindowStore.getState();
    const configs = resolveInitialPositions();
    for (const config of configs) {
      if (!windows[config.id]) {
        openWindow(config);
      }
    }
  }, [openWindow]);

  return (
    <>
      <AnimatePresence>
        {!bootDone && (
          <BootScreen key="boot" onDone={() => setBootDone(true)} />
        )}
      </AnimatePresence>
      <Desktop>
        <aside className={styles.foldersPanel} aria-label="Projets disponibles">
          <FoldersGrid />
        </aside>
        <MainWindow />
        <SubtitleWindow />
        <ImageWindow />
        <TerminalWindow />
        <CVWindow />
        {PROJECTS.map((project) => (
          <ProjectWindow key={project.slug} slug={project.slug} />
        ))}
      </Desktop>
    </>
  );
}
```

- [ ] **Step 2 : Vérifier build complet**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```

Résultat attendu : tout vert.

- [ ] **Step 3 : Tester manuellement dans le navigateur**

```bash
pnpm dev
```

Ouvrir `http://localhost:3000` en navigation privée (sessionStorage vierge). Vérifier :
- Écran noir CRT visible avec lignes vertes qui s'affichent une par une
- Clic ou touche → scan line CRT → desktop s'affiche
- Reload → boot screen absent (sessionStorage)
- Nouvel onglet ou navigation privée → boot screen rejoue

- [ ] **Step 4 : Commit**

```bash
git add src/components/os/Scene.tsx
git commit -m "feat: intégration BootScreen dans Scene avec AnimatePresence"
```

---

## Task 5 : Tests E2E

**Files:**
- Modify: `tests/e2e/golden-paths.spec.ts`

- [ ] **Step 1 : Ajouter les tests boot screen dans `golden-paths.spec.ts`**

Ajouter à la fin du fichier, avant la dernière accolade fermante du `test.describe` :

```ts
test("le boot screen s'affiche à la première visite", async ({ page }) => {
  // Session vierge : pas de sessionStorage
  await page.goto("/");
  // L'écran de boot est visible (fond noir avec texte vert)
  const boot = page.getByTestId("boot-screen");
  await expect(boot).toBeVisible();
  // Le texte "Portfolio OS" est présent
  await expect(page.getByText(/Portfolio OS 2026/)).toBeVisible();
});

test("le boot screen disparaît au clic et révèle le desktop", async ({ page }) => {
  await page.goto("/");
  const boot = page.getByTestId("boot-screen");
  await expect(boot).toBeVisible();
  // Skip via clic
  await boot.click();
  // Le boot screen doit disparaître
  await expect(boot).not.toBeVisible({ timeout: 2000 });
  // Le desktop est accessible
  await expect(page.getByText("System Designer")).toBeVisible();
});

test("le boot screen ne réapparaît pas après skip (sessionStorage)", async ({ page }) => {
  await page.goto("/");
  const boot = page.getByTestId("boot-screen");
  await boot.click();
  await expect(boot).not.toBeVisible({ timeout: 2000 });
  // Reload dans la même session
  await page.reload();
  // Le boot screen ne doit pas être présent
  await expect(page.getByText(/Portfolio OS 2026/)).not.toBeVisible();
});
```

- [ ] **Step 2 : Exécuter les tests E2E**

```bash
pnpm test:e2e
```

Résultat attendu : tous les nouveaux tests passent. Si un test E2E existant échoue à cause du boot screen (golden paths qui attendent directement le desktop), ajouter un skip du boot screen en début de test :

```ts
// En début de chaque test golden path existant qui cible le desktop :
await page.evaluate(() => sessionStorage.setItem("boot-done", "1"));
await page.goto("/");
```

- [ ] **Step 3 : Vérification finale complète**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm test:e2e && pnpm build
```

Résultat attendu : tout vert.

- [ ] **Step 4 : Commit final**

```bash
git add tests/e2e/golden-paths.spec.ts
git commit -m "test: tests E2E boot screen (affichage, skip, sessionStorage)"
```
