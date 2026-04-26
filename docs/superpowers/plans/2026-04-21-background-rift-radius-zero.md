# Background Rift & Radius Zéro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le fond indigo/violet par un dégradé animé Rift (bleu nuit + cramoisi + ambre) et supprimer tous les border-radius de l'UI.

**Architecture:** Trois fichiers CSS modifiés — `components.css` (vars composant + keyframes), `Desktop.module.css` (pseudo-élément animé), `themes.css` (override light). Un seul fichier composant touché : `OSBar.module.css` (radius hardcodé → var).

**Tech Stack:** CSS Modules, CSS custom properties, `@keyframes`, `prefers-reduced-motion`

---

## Fichiers modifiés

| Fichier | Rôle dans ce plan |
|---|---|
| `styles/tokens/components.css` | Radius vars → 0, `--desktop-bg` Rift, `@keyframes riftShift`, `--osbar-icon-radius` |
| `styles/tokens/themes.css` | `[data-theme="light"]` : override `--desktop-bg` → fond clair plat |
| `src/components/os/Desktop.module.css` | `.desktop` fond plat + `::before` pseudo-élément animé |
| `src/components/os/OSBar.module.css` | `.iconButton` : `border-radius` → `var(--osbar-icon-radius)` |

---

## Task 1 — Radius zéro dans components.css

**Files:**
- Modify: `styles/tokens/components.css`

- [ ] **Step 1 : Mettre à jour les vars radius composant**

Dans `styles/tokens/components.css`, remplacer toutes les lignes de radius composant par leurs équivalents à zéro. Le diff complet ci-dessous (lignes concernées seulement) :

```css
/* Window */
--window-radius: 0;
--window-bar-dot-radius: 0;        /* était 50% — les dots trafic-light deviennent carrés */

/* Dock */
--dock-radius: 0;
--dock-app-radius: 0;

/* Button */
--button-radius: 0;

/* Project folder */
--project-folder-radius: 0;
--project-folder-name-active-radius: 0;
--project-folder-outline-radius: 0;

/* Scrollbar */
--scrollbar-radius: 0;

/* Tag */
--tag-radius: 0;

/* Project cover */
--project-cover-radius: 0;
```

- [ ] **Step 2 : Ajouter `--osbar-icon-radius`** (nouvelle var, à placer dans la section OS Bar) :

```css
/* OS Bar */
/* ... vars existantes ... */
--osbar-icon-radius: 0;
```

- [ ] **Step 3 : Vérifier le lint**

```bash
pnpm lint
```
Attendu : aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: radius zéro sur tous les composants (window, dock, button, folder, tag, cover)"
```

---

## Task 2 — Radius OSBar hardcodé → var

**Files:**
- Modify: `src/components/os/OSBar.module.css:38`

- [ ] **Step 1 : Remplacer le radius primitif direct**

Ligne 38 de `src/components/os/OSBar.module.css`, remplacer :

```css
/* avant */
border-radius: var(--radius-xs);
```

par :

```css
/* après */
border-radius: var(--osbar-icon-radius);
```

- [ ] **Step 2 : Vérifier le lint**

```bash
pnpm lint
```
Attendu : aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add src/components/os/OSBar.module.css
git commit -m "style: osbar icon-button radius via var composant"
```

---

## Task 3 — Override desktop-bg pour le thème light

**Files:**
- Modify: `styles/tokens/themes.css`

- [ ] **Step 1 : Ajouter l'override dans `[data-theme="light"]`**

Dans `styles/tokens/themes.css`, à la fin du bloc `[data-theme="light"]` (avant la `}`), ajouter :

```css
  /* Desktop — fond clair plat, pas de gradient sombre Rift */
  --desktop-bg: var(--bg-base);
```

Le bloc complet devient :

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
git commit -m "style: override desktop-bg pour thème light (évite fond Rift en mode clair)"
```

---

## Task 4 — Palette Rift + @keyframes dans components.css

**Files:**
- Modify: `styles/tokens/components.css`

- [ ] **Step 1 : Remplacer `--desktop-bg`**

Dans `styles/tokens/components.css`, remplacer le bloc `--desktop-bg` existant (lignes 15-18) :

```css
/* avant */
--desktop-bg:
  radial-gradient(ellipse at top left, var(--color-indigo-700) 0%, transparent 55%),
  radial-gradient(ellipse at bottom right, var(--color-indigo-600) 0%, transparent 50%),
  linear-gradient(180deg, var(--bg-base) 0%, var(--color-indigo-900) 100%);
```

par :

```css
/* après — palette Rift (portée par ::before animé dans Desktop.module.css) */
--desktop-bg:
  radial-gradient(ellipse 70% 55% at 80% 20%, rgba(0, 25, 70, 0.75) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 10% 80%, rgba(70, 5, 20, 0.55) 0%, transparent 55%),
  radial-gradient(ellipse 55% 45% at 60% 90%, rgba(50, 35, 0, 0.40) 0%, transparent 50%);
```

- [ ] **Step 2 : Ajouter `@keyframes riftShift`**

À la fin de `styles/tokens/components.css`, après la dernière accolade `}` de `:root`, ajouter :

```css
@keyframes riftShift {
  0%   { opacity: 0.80; transform: scale(1)    translate(0, 0); }
  40%  { opacity: 1;    transform: scale(1.04) translate(-1.5%, 0.5%); }
  80%  { opacity: 0.85; transform: scale(0.97) translate(1%, -0.5%); }
  100% { opacity: 1;    transform: scale(1.01) translate(-0.5%, 1%); }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes riftShift {
    0%, 100% { opacity: 1; transform: none; }
  }
}
```

- [ ] **Step 3 : Vérifier le lint**

```bash
pnpm lint
```
Attendu : aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add styles/tokens/components.css
git commit -m "style: palette Rift desktop-bg + keyframes riftShift"
```

---

## Task 5 — Desktop ::before animé

**Files:**
- Modify: `src/components/os/Desktop.module.css`

- [ ] **Step 1 : Modifier `.desktop` et ajouter `::before`**

Remplacer le contenu complet de `src/components/os/Desktop.module.css` par :

```css
.desktop {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  background: #010208;
  color: var(--text-primary);
}

.desktop::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--desktop-bg);
  animation: riftShift 16s ease-in-out infinite alternate;
  z-index: 0;
  pointer-events: none;
}

.scene {
  position: relative;
  z-index: var(--z-desktop);
  min-height: 100dvh;
  padding-top: calc(var(--osbar-padding-y) * 2 + var(--osbar-icon-size));
  padding-bottom: calc(var(--dock-app-size) + var(--dock-padding-y) * 2 + var(--space-xl));
  padding-inline: var(--space-l);
}

.windowsLayer {
  position: relative;
  width: 100%;
  height: 100%;
}

@media (max-width: 1023px) {
  .scene {
    padding-inline: var(--space-m);
  }

  .windowsLayer {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    height: auto;
  }
}

@media (max-width: 639px) {
  .scene {
    padding-inline: var(--space-s);
    padding-top: calc(var(--osbar-padding-y) * 2 + var(--osbar-icon-size) + var(--space-s));
    padding-bottom: calc(var(--dock-app-size) + var(--dock-padding-y) * 2 + var(--space-l));
  }

  .windowsLayer {
    gap: var(--space-s);
  }
}
```

Note : le thème `retro` définit `--desktop-bg: var(--bg-base)` (fond crème plat) — le `::before` l'affichera sans animation visible (le dégradé est un flat color, donc l'oscillation de scale/translate ne crée aucun artefact visuel).

- [ ] **Step 2 : Lancer le serveur de dev et vérifier visuellement**

```bash
pnpm dev
```

Ouvrir `http://localhost:3000` et vérifier :
- Fond quasi-noir avec teintes Rift visibles (bleu nuit haut-droite, cramoisi bas-gauche, ambre bas-centre)
- Animation subtile observable après 3-4 secondes (oscillation très douce)
- Zéro border-radius sur fenêtres, dock, boutons, folders
- Les dots de la barre de titre des fenêtres sont carrés

- [ ] **Step 3 : Vérifier les thèmes**

Avec le serveur de dev ouvert :
1. Ouvrir DevTools → Application → localStorage → ajouter `theme: "retro"` → recharger : fond crème plat, aucun dégradé sombre
2. Modifier localStorage → `theme: "light"` → recharger : fond clair `#f5f5f7`, aucun dégradé sombre

- [ ] **Step 4 : Vérifier `prefers-reduced-motion`**

Dans DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce` : l'animation doit s'arrêter (fond fixe).

- [ ] **Step 5 : Typecheck + lint + tests**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```
Attendu : tous verts.

- [ ] **Step 6 : Commit**

```bash
git add src/components/os/Desktop.module.css
git commit -m "style: desktop fond Rift animé via pseudo-élément ::before"
```

---

## Task 6 — Vérification finale

- [ ] **Step 1 : Suite complète**

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```
Attendu : tous verts.

- [ ] **Step 2 : Contrôle visuel complet**

Avec `pnpm dev` :
- [ ] Fond Rift animé visible sur la page principale
- [ ] Fenêtres : angles carrés, aucun artefact de radius
- [ ] Dock : angles carrés
- [ ] Boutons : angles carrés
- [ ] Folders : angles carrés
- [ ] Tags : angles carrés (pilules devenues rectangles)
- [ ] Dots fenêtre : carrés
- [ ] Scrollbar : thumb carré
- [ ] Thème retro : aucune régression (fond crème, radius déjà 0 dans retro)
- [ ] Thème light : fond clair, aucun dégradé sombre

- [ ] **Step 3 : Commit de tag de fin de feature (optionnel)**

```bash
git tag -a v0.rift "$(git log --oneline -1 --format='%H')" -m "feat: background Rift animé + radius zéro"
```
