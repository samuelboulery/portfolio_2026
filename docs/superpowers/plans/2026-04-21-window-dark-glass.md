# Window Dark Glass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harmoniser les fenêtres avec le fond Rift : corps quasi-noir opaque, entête glassmorphism semi-transparent, bordure et ombre teintées bleu Rift.

**Architecture:** Trois fichiers CSS modifiés — `components.css` (vars `--window-*` + nouvelle `--window-bar-blur`), `WindowBar.module.css` (ajout `backdrop-filter`), `themes.css` (overrides thème light). Aucun composant React touché. Pas de tests unitaires : changement purement CSS, vérifié par lint + typecheck + build + contrôle visuel dev server.

**Tech Stack:** CSS custom properties, CSS Modules, `backdrop-filter`, Next.js / pnpm / Biome

---

## Fichiers modifiés

| Fichier | Rôle dans ce plan |
|---|---|
| `styles/tokens/components.css` | Mise à jour vars `--window-bg`, `--window-bg-gradient`, `--window-border`, `--window-shadow`, `--window-bar-bg` + ajout `--window-bar-blur` |
| `src/components/window/WindowBar.module.css` | Ajout `backdrop-filter: blur(var(--window-bar-blur))` sur `.bar` |
| `styles/tokens/themes.css` | Overrides `[data-theme="light"]` pour les nouvelles valeurs window |

---

## Task 1 — Vars window dans components.css

**Files:**
- Modify: `styles/tokens/components.css:23-50`

- [ ] **Step 1 : Remplacer le bloc window vars**

Dans `styles/tokens/components.css`, remplacer les lignes 23-50 (section Window) par :

```css
  --window-bg: rgba(4, 6, 18, 0.96);
  --window-bg-gradient: rgba(4, 6, 18, 0.96);
  --window-border: rgba(60, 80, 160, 0.45);
  --window-border-width: var(--border-width-s);
  --window-radius: 0;
  --window-shadow: 0 0 0 1px rgba(40, 60, 140, 0.18), 0 8px 32px rgba(0, 0, 0, 0.6);
  --window-min-width: 320px;
  --window-min-height: 200px;
  --window-resize-zone: 6px;

  --window-shadow-unfocused: 0 0 0 1px rgba(40, 60, 140, 0.08), 0 4px 16px rgba(0, 0, 0, 0.5);

  --window-bar-bg: rgba(10, 15, 40, 0.55);
  --window-bar-blur: 12px;
  --window-bar-padding-x: var(--space-m);
  --window-bar-padding-y: var(--space-s);
  --window-bar-gap: var(--space-xs);
  --window-bar-dot-size: 12px;
  --window-bar-dot-radius: 0;
  --window-bar-close: var(--accent-primary);
  --window-bar-reduce: var(--accent-secondary);
  --window-bar-expand: var(--accent-success);
  --window-bar-title-color: var(--text-muted);
  --window-bar-title-font: var(--font-ui);
  --window-bar-title-size: var(--fs-mono-s);

  --window-content-padding: var(--space-l);
```

Note : `--window-bg-gradient` reçoit la même valeur plate que `--window-bg` — le composant `Window.module.css` utilise `background: var(--window-bg-gradient, var(--window-bg))`, les deux sont identiques et produisent un fond uniforme quasi-noir. `--window-shadow-unfocused` est une version atténuée du glow Rift pour les fenêtres sans focus.

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur (1 warning pré-existant dans `.superpowers/` est normal).

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: fenêtres dark glass — vars window quasi-noir + entête rgba + bordure Rift"
```

---

## Task 2 — Ombre fenêtre non-focalisée dans Window.module.css

**Files:**
- Modify: `src/components/window/Window.module.css:18-20`

- [ ] **Step 1 : Remplacer var(--shadow-m) par --window-shadow-unfocused**

Dans `src/components/window/Window.module.css`, remplacer :

```css
.window[data-focused="false"] {
  box-shadow: var(--shadow-m);
}
```

par :

```css
.window[data-focused="false"] {
  box-shadow: var(--window-shadow-unfocused);
}
```

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/components/window/Window.module.css
git commit -m "style: ombre fenêtre non-focalisée via var(--window-shadow-unfocused)"
```

---

## Task 4 — backdrop-filter dans WindowBar.module.css

**Files:**
- Modify: `src/components/window/WindowBar.module.css:1-13`

- [ ] **Step 1 : Ajouter backdrop-filter sur .bar**

Dans `src/components/window/WindowBar.module.css`, le bloc `.bar` actuel est :

```css
.bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--window-bar-gap);
  padding: var(--window-bar-padding-y) var(--window-bar-padding-x);
  background: var(--window-bar-bg);
  border-bottom: var(--window-border-width) solid var(--window-border);
  border-top-left-radius: var(--window-radius);
  border-top-right-radius: var(--window-radius);
  user-select: none;
  touch-action: none;
}
```

Le remplacer par :

```css
.bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--window-bar-gap);
  padding: var(--window-bar-padding-y) var(--window-bar-padding-x);
  background: var(--window-bar-bg);
  backdrop-filter: blur(var(--window-bar-blur));
  -webkit-backdrop-filter: blur(var(--window-bar-blur));
  border-bottom: var(--window-border-width) solid var(--window-border);
  border-top-left-radius: var(--window-radius);
  border-top-right-radius: var(--window-radius);
  user-select: none;
  touch-action: none;
}
```

Note : `backdrop-filter` ne peut pas transiter via une CSS custom property — il doit être déclaré directement dans le CSS Module. La valeur du blur est pilotée par `--window-bar-blur` (définie en Task 1), ce qui respecte la règle "no hardcoded values". Le préfixe `-webkit-` est nécessaire pour Safari.

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/components/window/WindowBar.module.css
git commit -m "style: entête fenêtre glassmorphism via backdrop-filter"
```

---

## Task 5 — Overrides thème light dans themes.css

**Files:**
- Modify: `styles/tokens/themes.css`

- [ ] **Step 1 : Ajouter les overrides window dans [data-theme="light"]**

Dans `styles/tokens/themes.css`, à la fin du bloc `[data-theme="light"]` (avant la `}`), ajouter :

```css
  /* Window — fond blanc, entête claire, bordure neutre */
  --window-bg: rgba(255, 255, 255, 0.96);
  --window-bg-gradient: rgba(255, 255, 255, 0.96);
  --window-bar-bg: rgba(240, 240, 248, 0.72);
  --window-border: rgba(0, 0, 0, 0.14);
  --window-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.12);
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
}
```

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```

Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add styles/tokens/themes.css
git commit -m "style: overrides window thème light (fond blanc, entête claire, ombre neutre)"
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

- [ ] Fenêtres : corps quasi-noir opaque, nettement différent du fond Rift
- [ ] Entête de fenêtre : légèrement transparente, les lueurs Rift filtrent discrètement
- [ ] Bordure : teinte bleue Rift visible et cohérente
- [ ] Ombre : halo bleu léger autour de chaque fenêtre
- [ ] Fenêtre non-focalisée : ombre réduite (comportement existant — `var(--shadow-m)` dans `Window.module.css:19`)
- [ ] Thème retro : aucune régression (ses overrides `--window-bar-bg: #1a1a1a` et `--window-bg: #f5f0e8` prennent précédence)
- [ ] Thème light : fenêtres blanches, entête claire, ombre neutre (tester via DevTools → Application → localStorage → `theme: "light"` → recharger)
- [ ] Safari : vérifier que l'entête glassmorphism fonctionne (`-webkit-backdrop-filter` présent)

- [ ] **Step 3 : Commit de clôture si tout est vert**

```bash
git tag -a v0.window-dark-glass "$(git log --oneline -1 --format='%H')" -m "feat: fenêtres dark glass — glassmorphism entête + quasi-noir corps + bordure Rift"
```
