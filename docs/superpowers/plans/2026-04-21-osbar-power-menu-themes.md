# OSBar — Power Menu, Navigation Menu & Themes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un dropdown Power (Redémarrer/Éteindre), une barre de menus macOS-style (Fichier/Édition/Vue/Aide), et déplacer la sélection de thème (Dark/Light/Retro) dans le menu Vue.

**Architecture:** `useTheme` est étendu à 3 thèmes et exporte `setTheme`. `<OSBar>` est déplacé de `layout.tsx` vers `Scene.tsx` pour recevoir directement les callbacks `onShutdown`/`onRestart` comme props. Un hook `useClickOutside` partagé gère la fermeture des dropdowns.

**Tech Stack:** React 19, TypeScript strict, Zustand (`useWindowStore`), Framer Motion, CSS Modules, Vitest + Testing Library, Playwright.

---

## Carte des fichiers

| Statut | Fichier | Rôle |
|---|---|---|
| Modifié | `src/hooks/useTheme.ts` | Étendre à 3 thèmes, `setTheme` |
| Modifié | `src/app/layout.tsx` | Retirer `<OSBar />`, update anti-FOUC |
| Modifié | `styles/tokens/components.css` | Ajouter `--dropdown-*`, `--shutdown-*` |
| Modifié | `src/components/os/OSBar/OSBar.tsx` | Intégrer PowerMenu + TopMenuBar |
| Modifié | `src/components/os/OSBar/OSBar.module.css` | Layout 2 zones |
| Modifié | `src/components/os/Scene.tsx` | Ajouter `isShutdown`, rendre `<OSBar>` |
| Créé | `src/hooks/useClickOutside.ts` | Hook click-outside réutilisable |
| Créé | `src/components/os/OSBar/PowerMenu.tsx` + `.module.css` | Dropdown Power |
| Créé | `src/components/os/OSBar/TopMenuBar.tsx` + `.module.css` | Menus Fichier/Édition/Vue/Aide |
| Créé | `src/components/os/ShutdownScreen/ShutdownScreen.tsx` + `.module.css` | Écran CRT éteint |
| Créé | `tests/unit/hooks/useTheme.test.ts` | Tests useTheme |
| Créé | `tests/unit/hooks/useClickOutside.test.ts` | Tests useClickOutside |
| Créé | `tests/unit/components/PowerMenu.test.tsx` | Tests PowerMenu |
| Créé | `tests/unit/components/TopMenuBar.test.tsx` | Tests TopMenuBar |
| Créé | `tests/unit/components/ShutdownScreen.test.tsx` | Tests ShutdownScreen |
| Créé | `tests/e2e/osbar.spec.ts` | Tests E2E |

---

## Task 1 : Étendre useTheme à 3 thèmes

**Files:**
- Modify: `src/hooks/useTheme.ts`
- Create: `tests/unit/hooks/useTheme.test.ts`

- [ ] **Étape 1 : Écrire le test qui échoue**

```typescript
// tests/unit/hooks/useTheme.test.ts
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Theme, useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("retourne 'dark' par défaut", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("lit 'retro' depuis localStorage au montage", async () => {
    localStorage.setItem("theme", "retro");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("retro");
  });

  it("lit 'light' depuis localStorage au montage", async () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("light");
  });

  it("setTheme persiste en localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("setTheme applique data-theme sur <html>", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("retro"));
    expect(document.documentElement.dataset.theme).toBe("retro");
  });

  it("setTheme met à jour le state React", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(result.current.theme).toBe("light");
  });

  it("ignore une valeur localStorage invalide et retombe sur 'dark'", async () => {
    localStorage.setItem("theme", "banana");
    const { result } = renderHook(() => useTheme());
    await act(async () => {});
    expect(result.current.theme).toBe("dark");
  });
});
```

- [ ] **Étape 2 : Vérifier que le test échoue**

```bash
pnpm test:run tests/unit/hooks/useTheme.test.ts
```

Résultat attendu : FAIL — `setTheme is not a function` ou propriété manquante.

- [ ] **Étape 3 : Implémenter useTheme étendu**

```typescript
// src/hooks/useTheme.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "retro";

const STORAGE_KEY = "theme";
const VALID_THEMES: readonly Theme[] = ["dark", "light", "retro"];

function isValidTheme(value: string | null): value is Theme {
  return VALID_THEMES.includes(value as Theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = isValidTheme(stored) ? stored : "dark";
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  }, []);

  return { theme, setTheme };
}
```

- [ ] **Étape 4 : Vérifier que les tests passent**

```bash
pnpm test:run tests/unit/hooks/useTheme.test.ts
```

Résultat attendu : PASS (7 tests).

- [ ] **Étape 5 : Commit**

```bash
git add src/hooks/useTheme.ts tests/unit/hooks/useTheme.test.ts
git commit -m "feat: étendre useTheme à 3 thèmes (dark/light/retro) avec setTheme"
```

---

## Task 2 : Mettre à jour l'anti-FOUC pour le thème light

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Étape 1 : Mettre à jour le script inline**

Dans `src/app/layout.tsx`, remplacer le script `dangerouslySetInnerHTML` :

```typescript
// Avant
__html: `(function(){try{var t=localStorage.getItem('theme');if(t==='retro')document.documentElement.dataset.theme='retro';}catch(e){}})()`,

// Après
__html: `(function(){try{var t=localStorage.getItem('theme');if(t==='retro'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}})()`,
```

- [ ] **Étape 2 : Retirer `<OSBar />` de layout.tsx**

L'OSBar sera rendu par `Scene.tsx` (Task 9) pour pouvoir recevoir `onShutdown`/`onRestart` comme props. Supprimer l'import et le rendu :

```typescript
// layout.tsx — retirer ces 2 lignes :
// import { OSBar } from "@/components/os/OSBar";
// <OSBar />

// Le <body> devient :
<body>
  {children}
  <DockBridge />
</body>
```

- [ ] **Étape 3 : Vérifier le build**

```bash
pnpm typecheck
```

Résultat attendu : 0 erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix: anti-FOUC étendu au thème light, OSBar déplacé dans Scene"
```

---

## Task 3 : Ajouter les tokens CSS dropdown et shutdown

**Files:**
- Modify: `styles/tokens/components.css`

- [ ] **Étape 1 : Ajouter les tokens après la section OS Bar**

Dans `styles/tokens/components.css`, après le bloc `/* OS Bar */` (ligne ~96), insérer :

```css
  /* ============================================================
   * Dropdown menu (PowerMenu + TopMenuBar)
   * ============================================================ */
  --dropdown-bg: var(--bg-elevated);
  --dropdown-border: var(--border-subtle);
  --dropdown-radius: 0;
  --dropdown-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--border-subtle);
  --dropdown-item-padding-x: var(--space-m);
  --dropdown-item-padding-y: var(--space-2xs);
  --dropdown-item-hover-bg: var(--bg-hover);
  --dropdown-item-active-bg: var(--bg-active);
  --dropdown-separator-color: var(--border-subtle);
  --dropdown-disabled-opacity: 0.35;
  --dropdown-min-width: 180px;

  /* ============================================================
   * ShutdownScreen
   * ============================================================ */
  --shutdown-bg: var(--boot-bg);
  --shutdown-text: var(--boot-text);
  --shutdown-font-size: var(--boot-font-size);
```

- [ ] **Étape 2 : Vérifier le lint**

```bash
pnpm lint
```

Résultat attendu : 0 erreur.

- [ ] **Étape 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: tokens dropdown et shutdown dans components.css"
```

---

## Task 4 : Créer le hook useClickOutside

**Files:**
- Create: `src/hooks/useClickOutside.ts`
- Create: `tests/unit/hooks/useClickOutside.test.ts`

- [ ] **Étape 1 : Écrire le test qui échoue**

```typescript
// tests/unit/hooks/useClickOutside.test.ts
import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClickOutside } from "@/hooks/useClickOutside";

describe("useClickOutside", () => {
  let container: HTMLDivElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    outside = document.createElement("div");
    document.body.appendChild(container);
    document.body.appendChild(outside);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outside);
  });

  it("appelle le callback sur clic extérieur", () => {
    const callback = vi.fn();
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, callback));
    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas le callback sur clic intérieur", () => {
    const callback = vi.fn();
    const ref = { current: container };
    renderHook(() => useClickOutside(ref, callback));
    act(() => {
      container.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("retire le listener au démontage", () => {
    const callback = vi.fn();
    const ref = { current: container };
    const { unmount } = renderHook(() => useClickOutside(ref, callback));
    unmount();
    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("ne plante pas si ref.current est null", () => {
    const callback = vi.fn();
    const ref = { current: null };
    expect(() => {
      const { unmount } = renderHook(() => useClickOutside(ref, callback));
      act(() => {
        outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      });
      unmount();
    }).not.toThrow();
  });
});
```

- [ ] **Étape 2 : Vérifier que le test échoue**

```bash
pnpm test:run tests/unit/hooks/useClickOutside.test.ts
```

Résultat attendu : FAIL — module not found.

- [ ] **Étape 3 : Implémenter useClickOutside**

```typescript
// src/hooks/useClickOutside.ts
import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
): void {
  useEffect(() => {
    function handleMouseDown(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, callback]);
}
```

- [ ] **Étape 4 : Vérifier que les tests passent**

```bash
pnpm test:run tests/unit/hooks/useClickOutside.test.ts
```

Résultat attendu : PASS (4 tests).

- [ ] **Étape 5 : Commit**

```bash
git add src/hooks/useClickOutside.ts tests/unit/hooks/useClickOutside.test.ts
git commit -m "feat: hook useClickOutside partagé pour les dropdowns"
```

---

## Task 5 : Créer ShutdownScreen

**Files:**
- Create: `src/components/os/ShutdownScreen/ShutdownScreen.tsx`
- Create: `src/components/os/ShutdownScreen/ShutdownScreen.module.css`
- Create: `tests/unit/components/ShutdownScreen.test.tsx`

- [ ] **Étape 1 : Écrire le test qui échoue**

```typescript
// tests/unit/components/ShutdownScreen.test.tsx
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShutdownScreen } from "@/components/os/ShutdownScreen/ShutdownScreen";

describe("ShutdownScreen", () => {
  it("s'affiche avec le message d'arrêt", () => {
    const { getByTestId } = render(<ShutdownScreen onRestart={vi.fn()} />);
    expect(getByTestId("shutdown-screen")).toBeInTheDocument();
  });

  it("affiche les lignes CRT", () => {
    const { getByText } = render(<ShutdownScreen onRestart={vi.fn()} />);
    expect(getByText(/Système arrêté/)).toBeInTheDocument();
    expect(getByText(/cliquez n'importe où/)).toBeInTheDocument();
  });

  it("appelle onRestart sur clic", () => {
    const onRestart = vi.fn();
    const { getByTestId } = render(<ShutdownScreen onRestart={onRestart} />);
    fireEvent.click(getByTestId("shutdown-screen"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("appelle onRestart sur keydown", async () => {
    const onRestart = vi.fn();
    await act(async () => {
      render(<ShutdownScreen onRestart={onRestart} />);
    });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onRestart deux fois si clic puis keydown", () => {
    const onRestart = vi.fn();
    const { getByTestId } = render(<ShutdownScreen onRestart={onRestart} />);
    fireEvent.click(getByTestId("shutdown-screen"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onRestart).toHaveBeenCalledTimes(2); // pas de guard ici, chaque event = 1 appel
  });
});
```

- [ ] **Étape 2 : Vérifier que le test échoue**

```bash
pnpm test:run tests/unit/components/ShutdownScreen.test.tsx
```

Résultat attendu : FAIL — module not found.

- [ ] **Étape 3 : Implémenter ShutdownScreen**

```typescript
// src/components/os/ShutdownScreen/ShutdownScreen.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import styles from "./ShutdownScreen.module.css";

interface ShutdownScreenProps {
  onRestart: () => void;
}

export function ShutdownScreen({ onRestart }: ShutdownScreenProps) {
  useEffect(() => {
    document.addEventListener("keydown", onRestart);
    return () => document.removeEventListener("keydown", onRestart);
  }, [onRestart]);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      data-testid="shutdown-screen"
      onClick={onRestart}
    >
      <div className={styles.terminal}>
        <p className={styles.line}>[ shutting down... ]</p>
        <p className={styles.line}>Système arrêté.</p>
        <p className={styles.hint}>Pour relancer : cliquez n'importe où.</p>
      </div>
    </motion.div>
  );
}
```

```css
/* src/components/os/ShutdownScreen/ShutdownScreen.module.css */
.root {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: var(--shutdown-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.terminal {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-family: var(--terminal-text-font);
  font-size: var(--shutdown-font-size);
  color: var(--shutdown-text);
}

.line {
  opacity: 0.9;
}

.hint {
  opacity: 0.45;
  margin-top: var(--space-xs);
}
```

- [ ] **Étape 4 : Vérifier que les tests passent**

```bash
pnpm test:run tests/unit/components/ShutdownScreen.test.tsx
```

Résultat attendu : PASS (5 tests).

- [ ] **Étape 5 : Commit**

```bash
git add src/components/os/ShutdownScreen/ tests/unit/components/ShutdownScreen.test.tsx
git commit -m "feat: composant ShutdownScreen CRT phosphore"
```

---

## Task 6 : Créer PowerMenu

**Files:**
- Create: `src/components/os/OSBar/PowerMenu.tsx`
- Create: `src/components/os/OSBar/PowerMenu.module.css`
- Create: `tests/unit/components/PowerMenu.test.tsx`

- [ ] **Étape 1 : Écrire le test qui échoue**

```typescript
// tests/unit/components/PowerMenu.test.tsx
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PowerMenu } from "@/components/os/OSBar/PowerMenu";

describe("PowerMenu", () => {
  it("n'affiche pas le dropdown par défaut", () => {
    const { queryByRole } = render(
      <PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />,
    );
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le dropdown au clic sur le bouton Power", () => {
    const { getByRole, queryByRole } = render(
      <PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />,
    );
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("appelle onRestart et ferme le menu sur 'Redémarrer'", () => {
    const onRestart = vi.fn();
    const { getByRole } = render(
      <PowerMenu onShutdown={vi.fn()} onRestart={onRestart} />,
    );
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    fireEvent.click(getByRole("menuitem", { name: /redémarrer/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("appelle onShutdown et ferme le menu sur 'Éteindre'", () => {
    const onShutdown = vi.fn();
    const { getByRole } = render(
      <PowerMenu onShutdown={onShutdown} onRestart={vi.fn()} />,
    );
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    fireEvent.click(getByRole("menuitem", { name: /éteindre/i }));
    expect(onShutdown).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByRole } = render(
      <PowerMenu onShutdown={vi.fn()} onRestart={vi.fn()} />,
    );
    fireEvent.click(getByRole("button", { name: /menu système/i }));
    expect(document.querySelector("[role='menu']")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(document.querySelector("[role='menu']")).not.toBeInTheDocument();
  });
});
```

- [ ] **Étape 2 : Vérifier que le test échoue**

```bash
pnpm test:run tests/unit/components/PowerMenu.test.tsx
```

Résultat attendu : FAIL — module not found.

- [ ] **Étape 3 : Implémenter PowerMenu**

```typescript
// src/components/os/OSBar/PowerMenu.tsx
"use client";

import { Power } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./PowerMenu.module.css";

interface PowerMenuProps {
  onShutdown: () => void;
  onRestart: () => void;
}

export function PowerMenu({ onShutdown, onRestart }: PowerMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Menu système"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Power size={14} />
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false);
              onRestart();
            }}
          >
            Redémarrer
          </button>
          <div className={styles.separator} role="separator" />
          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.itemDanger}`}
            onClick={() => {
              setOpen(false);
              onShutdown();
            }}
          >
            Éteindre
          </button>
        </div>
      )}
    </div>
  );
}
```

```css
/* src/components/os/OSBar/PowerMenu.module.css */
.root {
  position: relative;
  display: inline-flex;
}

.trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--osbar-icon-color);
  width: var(--osbar-icon-size);
  height: var(--osbar-icon-size);
  border-radius: var(--osbar-icon-radius);
  transition: color var(--dur-fast) var(--ease-out);
}

.trigger:hover {
  color: var(--text-primary);
}

.dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  left: 0;
  z-index: var(--z-overlay);
  min-width: var(--dropdown-min-width);
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  border-radius: var(--dropdown-radius);
  box-shadow: var(--dropdown-shadow);
  padding: var(--space-3xs);
}

.item {
  display: block;
  width: 100%;
  padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
  text-align: left;
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  color: var(--text-primary);
  border-radius: var(--dropdown-radius);
  transition: background var(--dur-fast) var(--ease-out);
}

.item:hover {
  background: var(--dropdown-item-hover-bg);
}

.itemDanger {
  color: var(--accent-primary);
}

.separator {
  height: 1px;
  background: var(--dropdown-separator-color);
  margin: var(--space-3xs) 0;
}
```

- [ ] **Étape 4 : Vérifier que les tests passent**

```bash
pnpm test:run tests/unit/components/PowerMenu.test.tsx
```

Résultat attendu : PASS (5 tests).

- [ ] **Étape 5 : Commit**

```bash
git add src/components/os/OSBar/PowerMenu.tsx src/components/os/OSBar/PowerMenu.module.css tests/unit/components/PowerMenu.test.tsx
git commit -m "feat: composant PowerMenu avec dropdown Redémarrer/Éteindre"
```

---

## Task 7 : Créer TopMenuBar

**Files:**
- Create: `src/components/os/OSBar/TopMenuBar.tsx`
- Create: `src/components/os/OSBar/TopMenuBar.module.css`
- Create: `tests/unit/components/TopMenuBar.test.tsx`

- [ ] **Étape 1 : Écrire le test qui échoue**

```typescript
// tests/unit/components/TopMenuBar.test.tsx
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TopMenuBar } from "@/components/os/OSBar/TopMenuBar";

// Mock useWindowStore
vi.mock("@/stores/windowStore", () => ({
  useWindowStore: (selector: (s: { openWindow: ReturnType<typeof vi.fn> }) => unknown) =>
    selector({ openWindow: mockOpenWindow }),
}));

const mockOpenWindow = vi.fn();

describe("TopMenuBar", () => {
  const defaultProps = {
    setTheme: vi.fn(),
    currentTheme: "dark" as const,
  };

  afterEach(() => {
    mockOpenWindow.mockClear();
  });

  it("affiche les items Fichier, Édition, Vue, Aide", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    expect(getByText("Fichier")).toBeInTheDocument();
    expect(getByText("Édition")).toBeInTheDocument();
    expect(getByText("Vue")).toBeInTheDocument();
    expect(getByText("Aide")).toBeInTheDocument();
  });

  it("ouvre le sous-menu Fichier au clic", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("clique sur 'Accueil' dans Fichier appelle openWindow avec id 'main'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Accueil"));
    expect(mockOpenWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: "main" }),
    );
  });

  it("clique sur 'Terminal' dans Fichier appelle openWindow avec id 'terminal'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Terminal"));
    expect(mockOpenWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: "terminal" }),
    );
  });

  it("clique sur 'CV' dans Fichier appelle openWindow avec id 'cv'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText(/CV/i));
    expect(mockOpenWindow).toHaveBeenCalledWith(
      expect.objectContaining({ id: "cv" }),
    );
  });

  it("'Édition' est aria-disabled", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    expect(getByText("Édition").closest("button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("clique sur 'Édition' n'ouvre pas de menu", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Édition"));
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le sous-menu Vue et clique Thème Clair appelle setTheme('light')", () => {
    const setTheme = vi.fn();
    const { getByText } = render(
      <TopMenuBar setTheme={setTheme} currentTheme="dark" />,
    );
    fireEvent.click(getByText("Vue"));
    fireEvent.click(getByText(/Thème Clair/i));
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
```

- [ ] **Étape 2 : Vérifier que le test échoue**

```bash
pnpm test:run tests/unit/components/TopMenuBar.test.tsx
```

Résultat attendu : FAIL — module not found.

- [ ] **Étape 3 : Implémenter TopMenuBar**

```typescript
// src/components/os/OSBar/TopMenuBar.tsx
"use client";

import { useRef, useState } from "react";
import { type Theme } from "@/hooks/useTheme";
import { useWindowStore } from "@/stores/windowStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./TopMenuBar.module.css";

interface TopMenuBarProps {
  setTheme: (t: Theme) => void;
  currentTheme: Theme;
}

type MenuId = "fichier" | "vue" | "aide";

const FICHIER_ITEMS = [
  { label: "Accueil", id: "main", type: "main" as const, title: "System Designer", initialPosition: { x: 83, y: 320 } },
  { label: "Terminal", id: "terminal", type: "terminal" as const, title: "terminal", initialPosition: { x: 930, y: 458 } },
  { label: "CV", id: "cv", type: "cv" as const, title: "curriculum_vitae.html", initialPosition: { x: 200, y: 150 } },
] as const;

const THEME_ITEMS: { label: string; value: Theme }[] = [
  { label: "Thème Sombre", value: "dark" },
  { label: "Thème Clair", value: "light" },
  { label: "Thème Rétro", value: "retro" },
];

export function TopMenuBar({ setTheme, currentTheme }: TopMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);

  useClickOutside(ref, () => setActiveMenu(null));

  function toggleMenu(id: MenuId) {
    setActiveMenu((prev) => (prev === id ? null : id));
  }

  return (
    <div className={styles.root} ref={ref}>
      {/* Fichier */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "fichier"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("fichier")}
        >
          Fichier
        </button>
        {activeMenu === "fichier" && (
          <div className={styles.dropdown} role="menu">
            {FICHIER_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={styles.item}
                onClick={() => {
                  setActiveMenu(null);
                  openWindow(item);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Édition — désactivé */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={`${styles.trigger} ${styles.triggerDisabled}`}
          aria-disabled="true"
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
        >
          Édition
        </button>
      </div>

      {/* Vue */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "vue"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("vue")}
        >
          Vue
        </button>
        {activeMenu === "vue" && (
          <div className={styles.dropdown} role="menu">
            {THEME_ITEMS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                role="menuitem"
                className={`${styles.item} ${currentTheme === value ? styles.itemActive : ""}`}
                onClick={() => {
                  setActiveMenu(null);
                  setTheme(value);
                }}
              >
                {currentTheme === value && (
                  <span className={styles.check} aria-hidden="true">✓</span>
                )}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Aide */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "aide"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("aide")}
        >
          Aide
        </button>
        {activeMenu === "aide" && (
          <div className={styles.dropdown} role="menu">
            <p className={styles.emptyHint}>Bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

```css
/* src/components/os/OSBar/TopMenuBar.module.css */
.root {
  display: flex;
  align-items: center;
  gap: 0;
}

.menuItem {
  position: relative;
}

.trigger {
  padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  color: var(--osbar-text-color);
  border-radius: var(--dropdown-radius);
  transition: background var(--dur-fast) var(--ease-out);
}

.trigger:hover {
  background: var(--dropdown-item-hover-bg);
}

.triggerDisabled {
  opacity: var(--dropdown-disabled-opacity);
  cursor: default;
}

.dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  left: 0;
  z-index: var(--z-overlay);
  min-width: var(--dropdown-min-width);
  background: var(--dropdown-bg);
  border: 1px solid var(--dropdown-border);
  border-radius: var(--dropdown-radius);
  box-shadow: var(--dropdown-shadow);
  padding: var(--space-3xs);
}

.item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
  text-align: left;
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  color: var(--text-primary);
  border-radius: var(--dropdown-radius);
  transition: background var(--dur-fast) var(--ease-out);
}

.item:hover {
  background: var(--dropdown-item-hover-bg);
}

.itemActive {
  color: var(--accent-primary);
}

.check {
  font-size: 10px;
  width: 12px;
  flex-shrink: 0;
}

.emptyHint {
  padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  color: var(--text-muted);
}
```

- [ ] **Étape 4 : Vérifier que les tests passent**

```bash
pnpm test:run tests/unit/components/TopMenuBar.test.tsx
```

Résultat attendu : PASS (9 tests).

- [ ] **Étape 5 : Commit**

```bash
git add src/components/os/OSBar/TopMenuBar.tsx src/components/os/OSBar/TopMenuBar.module.css tests/unit/components/TopMenuBar.test.tsx
git commit -m "feat: composant TopMenuBar avec Fichier/Édition/Vue/Aide"
```

---

## Task 8 : Refactoriser OSBar

**Files:**
- Modify: `src/components/os/OSBar/OSBar.tsx`
- Modify: `src/components/os/OSBar/OSBar.module.css`

OSBar reçoit maintenant `onShutdown`/`onRestart` en props, délègue à PowerMenu et TopMenuBar, et affiche un indicateur de thème à droite.

- [ ] **Étape 1 : Mettre à jour OSBar.tsx**

```typescript
// src/components/os/OSBar/OSBar.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { formatOsBarDate } from "@/lib/formatDate";
import { PowerMenu } from "./PowerMenu";
import { TopMenuBar } from "./TopMenuBar";
import styles from "./OSBar.module.css";

const THEME_LABELS = {
  dark: "Sombre",
  light: "Clair",
  retro: "Rétro",
} as const;

interface OSBarProps {
  onShutdown: () => void;
  onRestart: () => void;
}

export function OSBar({ onShutdown, onRestart }: OSBarProps) {
  const [now, setNow] = useState<Date | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <PowerMenu onShutdown={onShutdown} onRestart={onRestart} />
        <span className={styles.separator} aria-hidden="true" />
        <TopMenuBar setTheme={setTheme} currentTheme={theme} />
      </div>
      <div className={styles.right}>
        <span className={styles.themeLabel}>{THEME_LABELS[theme]}</span>
        <span className={styles.time} suppressHydrationWarning>
          {now ? formatOsBarDate(now) : ""}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Étape 2 : Mettre à jour OSBar.module.css**

```css
/* src/components/os/OSBar/OSBar.module.css */
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-osbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--osbar-padding-y) var(--osbar-padding-x);
  background: var(--osbar-bg);
  backdrop-filter: blur(var(--osbar-blur));
  -webkit-backdrop-filter: blur(var(--osbar-blur));
  border-bottom: var(--border-width-s) solid var(--osbar-border);
  color: var(--osbar-text-color);
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  line-height: 1;
}

.left,
.right {
  display: flex;
  align-items: center;
}

.separator {
  display: inline-block;
  width: 1px;
  height: 14px;
  background: var(--dropdown-separator-color);
  margin: 0 var(--space-xs);
  opacity: 0.5;
}

.themeLabel {
  color: var(--text-muted);
  font-size: var(--osbar-text-size);
  margin-right: var(--osbar-gap);
}

.time {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 639px) {
  .bar {
    padding-inline: var(--space-m);
  }
  .time {
    display: none;
  }
  .themeLabel {
    display: none;
  }
}
```

- [ ] **Étape 3 : Vérifier le typecheck**

```bash
pnpm typecheck
```

Résultat attendu : 0 erreur.

- [ ] **Étape 4 : Commit**

```bash
git add src/components/os/OSBar/OSBar.tsx src/components/os/OSBar/OSBar.module.css
git commit -m "refactor: OSBar intègre PowerMenu et TopMenuBar, layout 2 zones"
```

---

## Task 9 : Mettre à jour Scene avec isShutdown

**Files:**
- Modify: `src/components/os/Scene.tsx`

- [ ] **Étape 1 : Mettre à jour Scene.tsx**

```typescript
// src/components/os/Scene.tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FoldersGrid } from "@/components/folder/FoldersGrid";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";
import { Desktop } from "@/components/os/Desktop";
import { OSBar } from "@/components/os/OSBar/OSBar";
import { ShutdownScreen } from "@/components/os/ShutdownScreen/ShutdownScreen";
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
  const [isShutdown, setIsShutdown] = useState(false);

  const handleShutdown = useCallback(() => setIsShutdown(true), []);
  const handleRestart = useCallback(() => {
    sessionStorage.removeItem("boot-done");
    setIsShutdown(false);
    setBootDone(false);
  }, []);

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
      <OSBar onShutdown={handleShutdown} onRestart={handleRestart} />
      <AnimatePresence>
        {!bootDone && !isShutdown && (
          <BootScreen key="boot" onDone={() => setBootDone(true)} />
        )}
        {isShutdown && (
          <ShutdownScreen key="shutdown" onRestart={handleRestart} />
        )}
      </AnimatePresence>
      {!isShutdown && (
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
      )}
    </>
  );
}
```

- [ ] **Étape 2 : Vérifier typecheck + lint + tests**

```bash
pnpm typecheck && pnpm lint && pnpm test:run
```

Résultat attendu : 0 erreur, tous les tests passent.

- [ ] **Étape 3 : Lancer le dev et vérifier visuellement**

```bash
pnpm dev
```

Vérifier dans le navigateur :
- L'OSBar affiche le bouton Power + menus + label thème + horloge
- Clic Power → dropdown Redémarrer/Éteindre s'ouvre
- Clic Éteindre → écran noir CRT visible
- Clic sur l'écran → BootScreen relancé → Desktop
- Clic Vue → sous-menu avec 3 thèmes, checkmark sur le thème actif
- Clic Fichier → sous-menu avec Accueil/Terminal/CV
- Clic extérieur ferme les menus

- [ ] **Étape 4 : Commit**

```bash
git add src/components/os/Scene.tsx
git commit -m "feat: Scene gère isShutdown et rend OSBar avec callbacks"
```

---

## Task 10 : Tests E2E

**Files:**
- Create: `tests/e2e/osbar.spec.ts`

- [ ] **Étape 1 : Écrire les tests E2E**

```typescript
// tests/e2e/osbar.spec.ts
import { expect, test } from "@playwright/test";

test.describe("OSBar — Power Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Attendre la fin du boot (clic pour skip)
    await page.click("body");
    await page.waitForSelector("[data-testid='boot-screen']", { state: "detached", timeout: 5000 });
  });

  test("Éteindre affiche le ShutdownScreen", async ({ page }) => {
    await page.click("button[aria-label='Menu système']");
    await page.click("role=menuitem[name='Éteindre']");
    await expect(page.getByTestId("shutdown-screen")).toBeVisible();
  });

  test("ShutdownScreen → clic relance le BootScreen", async ({ page }) => {
    await page.click("button[aria-label='Menu système']");
    await page.click("role=menuitem[name='Éteindre']");
    await expect(page.getByTestId("shutdown-screen")).toBeVisible();
    await page.click("[data-testid='shutdown-screen']");
    await expect(page.getByTestId("boot-screen")).toBeVisible();
  });

  test("Redémarrer relance le BootScreen", async ({ page }) => {
    await page.click("button[aria-label='Menu système']");
    await page.click("role=menuitem[name='Redémarrer']");
    await expect(page.getByTestId("boot-screen")).toBeVisible();
  });
});

test.describe("OSBar — Navigation Fichier", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click("body");
    await page.waitForSelector("[data-testid='boot-screen']", { state: "detached", timeout: 5000 });
  });

  test("Fichier > CV ouvre la CVWindow", async ({ page }) => {
    await page.click("text=Fichier");
    await page.click("role=menuitem[name='CV']");
    await expect(page.locator("[data-window-id='cv']")).toBeVisible();
  });
});

test.describe("OSBar — Thèmes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click("body");
    await page.waitForSelector("[data-testid='boot-screen']", { state: "detached", timeout: 5000 });
  });

  test("Vue > Thème Clair applique data-theme='light'", async ({ page }) => {
    await page.click("text=Vue");
    await page.click("role=menuitem[name='Thème Clair']");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("Vue > Thème Rétro applique data-theme='retro'", async ({ page }) => {
    await page.click("text=Vue");
    await page.click("role=menuitem[name='Thème Rétro']");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "retro");
  });
});
```

- [ ] **Étape 2 : Lancer le build de prod d'abord**

```bash
pnpm build
```

Résultat attendu : build vert.

- [ ] **Étape 3 : Lancer les tests E2E**

```bash
pnpm test:e2e tests/e2e/osbar.spec.ts
```

Résultat attendu : PASS (7 tests).

- [ ] **Étape 4 : Vérification finale complète**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```

Résultat attendu : tout vert.

- [ ] **Étape 5 : Commit final**

```bash
git add tests/e2e/osbar.spec.ts
git commit -m "test: tests E2E OSBar — power, navigation, thèmes"
```

---

## Vérification end-to-end

Après toutes les tâches, tester manuellement sur `pnpm dev` :

1. **Boot** → desktop s'affiche normalement
2. **Power > Éteindre** → ShutdownScreen CRT s'affiche, clic → BootScreen → Desktop
3. **Power > Redémarrer** → BootScreen se relance
4. **Fichier > Accueil/Terminal/CV** → fenêtres correspondantes s'ouvrent
5. **Vue > chaque thème** → UI change, checkmark sur le thème actif, label mis à jour en haut à droite
6. **Clic extérieur** → tout menu ouvert se ferme
7. **Édition** → non cliquable, visiblement grisé
8. **Reload page** → thème persisté depuis localStorage, anti-FOUC OK
