# Interface Dark Glass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harmoniser Dock, OSBar et Project Folders avec le fond Rift — même palette quasi-noir/glassmorphism/bordures teintées que les fenêtres déjà traitées.

**Architecture:** Quatre fichiers CSS modifiés — `components.css` (vars Dock, OSBar, Folder), `OSBar.module.css` (ajout `backdrop-filter`), `themes.css` (overrides light + retro). Le Dock possède déjà `backdrop-filter: blur(var(--dock-blur))` dans son module CSS — seules les vars changent. Aucun composant React touché.

**Tech Stack:** CSS custom properties, CSS Modules, `backdrop-filter`, Next.js / pnpm / Biome

---

## Fichiers modifiés

| Fichier | Rôle dans ce plan |
|---|---|
| `styles/tokens/components.css` | Vars `--dock-*` (bg, border, blur, shadow, app-bg, app-border) + vars `--osbar-*` (bg, border + nouvelle `--osbar-blur`) + vars `--project-folder-*` (bg-1, bg-2, border-color) |
| `src/components/os/OSBar.module.css` | Ajout `backdrop-filter: blur(var(--osbar-blur))` + `-webkit-backdrop-filter` sur `.bar` |
| `styles/tokens/themes.css` | Overrides `[data-theme="light"]` (Dock, OSBar, Folder) + overrides `[data-theme="retro"]` pour OSBar |

---

## Task 1 — Vars Dock dans components.css

**Files:**
- Modify: `styles/tokens/components.css:55-76`

- [ ] **Step 1 : Remplacer le bloc Dock vars**

Dans `styles/tokens/components.css`, trouver le bloc suivant :

```css
  --dock-bg: rgba(21, 12, 69, 0.6);
  --dock-border: var(--color-indigo-700);
  --dock-radius: 0;
  --dock-padding-x: var(--space-m);
  --dock-padding-y: var(--space-s);
  --dock-gap: var(--space-m);
  --dock-blur: var(--blur-xs);
  --dock-shadow:
    16px 16px 24px 0 var(--color-black-20), 8px 8px 16px 0 var(--color-black-20),
    2px 2px 4px 0 var(--color-black-40);

  --dock-app-size: 40px;
  --dock-app-size-mobile: var(--touch-target-min);
  --dock-app-radius: 0;
  --dock-app-bg-1: var(--color-indigo-800);
  --dock-app-bg-2: var(--color-indigo-900);
  --dock-app-gradient-stop: 27.4%;
  --dock-app-border: var(--color-indigo-700);
  --dock-app-border-width: var(--border-width-s);
  --dock-app-shadow:
    16px 16px 24px 0 var(--color-black-20), 8px 8px 16px 0 var(--color-black-20),
    2px 2px 4px 0 var(--color-black-40);
  --dock-app-hover-bg: var(--bg-hover);
```

Et le remplacer par :

```css
  --dock-bg: rgba(10, 15, 40, 0.55);
  --dock-border: rgba(60, 80, 160, 0.45);
  --dock-radius: 0;
  --dock-padding-x: var(--space-m);
  --dock-padding-y: var(--space-s);
  --dock-gap: var(--space-m);
  --dock-blur: 12px;
  --dock-shadow:
    0 0 0 1px rgba(40, 60, 140, 0.18),
    0 8px 32px rgba(0, 0, 0, 0.6);

  --dock-app-size: 40px;
  --dock-app-size-mobile: var(--touch-target-min);
  --dock-app-radius: 0;
  --dock-app-bg-1: rgba(15, 20, 55, 0.9);
  --dock-app-bg-2: rgba(8, 12, 40, 0.95);
  --dock-app-gradient-stop: 27.4%;
  --dock-app-border: rgba(60, 80, 160, 0.35);
  --dock-app-border-width: var(--border-width-s);
  --dock-app-shadow:
    16px 16px 24px 0 var(--color-black-20), 8px 8px 16px 0 var(--color-black-20),
    2px 2px 4px 0 var(--color-black-40);
  --dock-app-hover-bg: var(--bg-hover);
```

Note : `--dock-blur` passe de `var(--blur-xs)` à `12px` — valeur directe car `Dock.module.css` déclare déjà `backdrop-filter: blur(var(--dock-blur))`. La `--dock-shadow` est remplacée par un glow Rift cohérent avec `--window-shadow`. `--dock-display` et `--dock-app-shadow` restent inchangés.

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur (1 warning pré-existant dans `.superpowers/` est normal).

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: dock dark glass — vars bg/border/blur/shadow Rift"
```

---

## Task 2 — Vars OSBar dans components.css

**Files:**
- Modify: `styles/tokens/components.css:86-87`

- [ ] **Step 1 : Remplacer et compléter le bloc OSBar vars**

Dans `styles/tokens/components.css`, remplacer les lignes 86-87 (les deux premières vars de la section OSBar) :

Avant :
```css
  --osbar-bg: var(--bg-elevated);
  --osbar-border: var(--border-subtle);
  --osbar-padding-x: var(--space-l);
```

Après :
```css
  --osbar-bg: rgba(10, 15, 40, 0.55);
  --osbar-border: rgba(60, 80, 160, 0.35);
  --osbar-blur: 12px;
  --osbar-padding-x: var(--space-l);
```

Note : `--osbar-blur` est une nouvelle var. `backdrop-filter` ne peut pas être stocké dans une custom property — il sera déclaré directement dans `OSBar.module.css` (Task 4) en consommant `--osbar-blur`.

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: osbar dark glass — vars bg/border Rift + nouvelle --osbar-blur"
```

---

## Task 3 — Vars Project Folder dans components.css

**Files:**
- Modify: `styles/tokens/components.css:127-130`

- [ ] **Step 1 : Remplacer les vars de fond et bordure du folder**

Dans `styles/tokens/components.css`, remplacer les lignes 127-130 (les 3 vars bg et border) :

Avant :
```css
  --project-folder-bg-1: var(--color-indigo-800);
  --project-folder-bg-2: var(--color-indigo-900);
  --project-folder-gradient-stop: 27.4%;
  --project-folder-border-color: var(--color-indigo-700);
```

Après :
```css
  --project-folder-bg-1: rgba(15, 18, 50, 0.95);
  --project-folder-bg-2: rgba(8, 10, 35, 0.98);
  --project-folder-gradient-stop: 27.4%;
  --project-folder-border-color: rgba(80, 100, 180, 0.35);
```

Note : Pas de blur sur les folders — ils sont des icônes posées sur le desktop, pas des éléments flottants. La bordure est légèrement plus subtile que les fenêtres (`rgba(80,100,180,0.35)` vs `rgba(60,80,160,0.45)`).

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: project folders dark glass — fond indigo désaturé, bordure Rift subtile"
```

---

## Task 4 — backdrop-filter dans OSBar.module.css

**Files:**
- Modify: `src/components/os/OSBar.module.css:1-18`

- [ ] **Step 1 : Ajouter backdrop-filter sur .bar**

Dans `src/components/os/OSBar.module.css`, le bloc `.bar` actuel est :

```css
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-osbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--osbar-gap);
  padding: var(--osbar-padding-y) var(--osbar-padding-x);
  background: var(--osbar-bg);
  border-bottom: var(--border-width-s) solid var(--osbar-border);
  color: var(--osbar-text-color);
  font-family: var(--osbar-text-font);
  font-size: var(--osbar-text-size);
  line-height: 1;
}
```

Le remplacer par :

```css
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-osbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--osbar-gap);
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
```

Note : `backdrop-filter` ne peut pas transiter via une CSS custom property — il doit être déclaré directement dans le CSS Module. La valeur du blur est pilotée par `--osbar-blur` (définie en Task 2). Le préfixe `-webkit-` est requis pour Safari.

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/components/os/OSBar.module.css
git commit -m "style: osbar glassmorphism via backdrop-filter"
```

---

## Task 5 — Overrides thèmes light et retro dans themes.css

**Files:**
- Modify: `styles/tokens/themes.css`

- [ ] **Step 1 : Ajouter les overrides Dock/OSBar/Folder dans [data-theme="light"]**

Dans `styles/tokens/themes.css`, à la fin du bloc `[data-theme="light"]` (avant la `}`), après les overrides window existants, ajouter :

```css
  /* Dock — fond blanc translucide */
  --dock-bg: rgba(255, 255, 255, 0.72);
  --dock-border: rgba(0, 0, 0, 0.12);
  --dock-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.12);
  --dock-app-bg-1: rgba(245, 245, 250, 0.9);
  --dock-app-bg-2: rgba(235, 235, 245, 0.95);
  --dock-app-border: rgba(0, 0, 0, 0.10);

  /* OSBar — fond blanc translucide */
  --osbar-bg: rgba(255, 255, 255, 0.72);
  --osbar-border: rgba(0, 0, 0, 0.10);

  /* Folders — fond clair neutre */
  --project-folder-bg-1: rgba(240, 240, 248, 0.95);
  --project-folder-bg-2: rgba(230, 230, 242, 0.98);
  --project-folder-border-color: rgba(0, 0, 0, 0.12);
```

Le bloc `[data-theme="light"]` complet devient :

```css
[data-theme="light"] {
  --bg-base: #f5f5f7;
  --bg-elevated: #ffffff;
  --bg-surface: #ffffff;
  --bg-surface-alt: #efeff4;
  --bg-hover: #e4e4ea;
  --bg-active: #d8d8df;
  --bg-overlay: rgba(0, 0, 0, 0.4);

  --border-default: #d8d8df;
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.24);

  --text-primary: #111114;
  --text-secondary: rgba(17, 17, 20, 0.8);
  --text-muted: rgba(17, 17, 20, 0.64);
  --text-decorative: rgba(17, 17, 20, 0.48);
  --text-disabled: rgba(17, 17, 20, 0.28);
  --text-on-accent: #ffffff;

  /* Desktop — fond clair plat, pas de gradient sombre Rift */
  --desktop-bg: var(--bg-base);

  /* Window — fond blanc, entête claire, bordure neutre */
  --window-bg: rgba(255, 255, 255, 0.96);
  --window-bg-gradient: rgba(255, 255, 255, 0.96);
  --window-bar-bg: rgba(240, 240, 248, 0.72);
  --window-border: rgba(0, 0, 0, 0.14);
  --window-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.12);

  /* Dock — fond blanc translucide */
  --dock-bg: rgba(255, 255, 255, 0.72);
  --dock-border: rgba(0, 0, 0, 0.12);
  --dock-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.12);
  --dock-app-bg-1: rgba(245, 245, 250, 0.9);
  --dock-app-bg-2: rgba(235, 235, 245, 0.95);
  --dock-app-border: rgba(0, 0, 0, 0.10);

  /* OSBar — fond blanc translucide */
  --osbar-bg: rgba(255, 255, 255, 0.72);
  --osbar-border: rgba(0, 0, 0, 0.10);

  /* Folders — fond clair neutre */
  --project-folder-bg-1: rgba(240, 240, 248, 0.95);
  --project-folder-bg-2: rgba(230, 230, 242, 0.98);
  --project-folder-border-color: rgba(0, 0, 0, 0.12);
}
```

- [ ] **Step 2 : Ajouter les overrides OSBar dans [data-theme="retro"]**

Le thème retro surcharge `--dock-display: none` (Dock invisible) et tous les `--project-folder-*` (crème/noir). Mais `--osbar-bg` n'est pas surchargé — il héritera de la nouvelle valeur `rgba(10,15,40,0.55)` au lieu du crème actuel. Il faut préserver l'apparence crème de l'OSBar en retro.

Dans `styles/tokens/themes.css`, dans le bloc `[data-theme="retro"]`, après la ligne `/* Dock caché */` et `--dock-display: none;`, ajouter :

```css
  /* OSBar — fond crème Mac Lisa, bordure noire */
  --osbar-bg: #f0ebe0;
  --osbar-border: #1a1a1a;
```

- [ ] **Step 3 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add styles/tokens/themes.css
git commit -m "style: overrides Dock/OSBar/Folder thèmes light et retro"
```

---

## Task 6 — Vérification finale

**Files:** (lecture seule — aucune modification)

- [ ] **Step 1 : Suite complète**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```

Attendu : tous verts. Si une erreur Biome apparaît sur les valeurs rgba, lancer `pnpm lint:fix` pour l'auto-corriger.

- [ ] **Step 2 : Contrôle visuel sur le dev server**

```bash
pnpm dev
```

Ouvrir `http://localhost:3000` et vérifier :

- [ ] Dock : glassmorphism visible, lueurs Rift filtrent à travers le fond
- [ ] OSBar : glassmorphism cohérent avec Dock et entête de fenêtre
- [ ] Project Folders : fond sombre teinté, distincts du fond Rift
- [ ] Bordures : teinte bleue Rift cohérente sur Dock, OSBar et fenêtres
- [ ] Thème retro : Dock masqué, OSBar crème, Folders crème/noir (tester via DevTools → Application → localStorage → `theme: "retro"` → recharger)
- [ ] Thème light : Dock/OSBar blancs translucides, Folders clairs (tester via `theme: "light"`)
- [ ] Safari : vérifier que l'OSBar glassmorphism fonctionne (`-webkit-backdrop-filter` présent)

- [ ] **Step 3 : Commit de clôture si tout est vert**

```bash
git tag -a v0.interface-dark-glass "$(git log --oneline -1 --format='%H')" -m "feat: interface dark glass — Dock/OSBar/Folders harmonisés avec le fond Rift"
```
