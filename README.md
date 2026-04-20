# Portfolio 2026 — Samuel Boulery

Portfolio personnel sous forme d'**environnement macOS-like** dans le navigateur : fond sombre, fenêtres draggables, dock animé, barre OS et terminal cliquable qui révèle les études de cas projet. System Designer & Token Architect (EDF / CBTW).

> Captures d'écran à venir — poser les fichiers dans `public/screenshots/` puis les référencer ici.

## Stack

- **Framework** : Next.js 16 (App Router + Turbopack) • React 19 • TypeScript strict
- **Styling** : CSS Modules + CSS custom properties (hiérarchie de tokens à 3 couches, pas de Tailwind)
- **State fenêtres** : Zustand (focus, position, z-index, open / minimized) persisté en `sessionStorage`
- **Drag** : framer-motion (`useDragControls`)
- **Contenu projets** : MDX statique (`content/projects/*.mdx`) via `@next/mdx`
- **Qualité** : Biome (lint + format)
- **Tests** : Vitest (unit) + Playwright (e2e — chromium + mobile-safari)
- **Package manager** : pnpm

## Démarrer

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

### Commandes clés

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur Next.js (Turbopack) sur :3000 |
| `pnpm build` | Build production |
| `pnpm start` | Serve le build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | Biome check (+ autofix) |
| `pnpm format` | Biome format |
| `pnpm test` / `pnpm test:run` | Vitest (watch / CI) |
| `pnpm test:e2e` | Playwright (chromium + mobile-safari) |

### Prérequis E2E

Avant le premier `pnpm test:e2e`, installer les binaires Playwright :

```bash
pnpm exec playwright install chromium webkit
```

## Architecture

Scène unique (`/`) composée de `Desktop` (gradient) + `OSBar` (top) + `Dock` (bottom) + plusieurs `Window` flottantes. Les projets sont accessibles via `TerminalWindow` cliquable **ou** les `ProjectFolder` du desktop, et s'ouvrent dans une `ProjectWindow` qui lit du MDX statique.

```
app/page.tsx
├── OSBar              ← date live, nom, power icon
├── Desktop            ← fond radial / linear
│   ├── FoldersGrid    ← 5 ProjectFolder (EDF, Mazars, Bonum, Greenweez, Portfolio)
│   └── WindowsLayer   ← MainWindow / SubtitleWindow / TerminalWindow / ImageWindow / CVWindow / ProjectWindow
└── Dock               ← 6 apps, indicateurs actifs liés au windowStore
```

Le store Zustand (`src/stores/windowStore.ts`) est la source unique de vérité pour l'état des fenêtres. La persistance sessionStorage (clé `portfolio_2026:windows`) garde positions et état ouvert/fermé au reload.

## Design system — 3 couches strictes

Tout passe par `styles/tokens/` (CSS custom properties). **Aucun composant ne consomme une primitive directement.**

```
primitives.css    ← valeurs brutes (couleurs, type scales, spacing, radius, motion)
  ↓
semantic.css      ← aliases d'intention (--bg-base, --text-primary, --accent-primary)
  ↓
components.css    ← vars scopées par composant (--window-*, --dock-*, --button-*)
  ↓
themes.css        ← wrappers [data-theme="*"] qui réassignent primitives → sémantiques
```

**Test de validité du DS** : ajouter `<html data-theme="light">` avec des overrides sur `primitives.css` doit flipper toute l'UI sans qu'un seul composant ne casse.

## Tests E2E — parcours golden

`tests/e2e/golden-paths.spec.ts` couvre les 3 flux critiques (desktop + mobile) :

1. **Terminal → CV** : click sur `curriculum_vitae.html` dans `TerminalWindow` → `CVWindow` s'ouvre.
2. **Folder EDF → projet** : click sur le dossier EDF → `ProjectWindow` s'ouvre avec ses tags visibles (`Design System`, `Tokens`, `Figma`, `Governance`).
3. **Drag persistant** (chromium seulement, drag désactivé en mobile) : drag `MainWindow`, vérifier que la position est persistée en sessionStorage et conservée après `reload()`.

## Budget Lighthouse

Cible : **≥ 95** sur performance / accessibilité / best-practices / SEO. Défini en constante exportée dans `next.config.ts` (`lighthouseBudget`) comme référence partagée pour une future intégration Lighthouse CI.

## Contenu

- Études de cas : `content/projects/*.mdx` (frontmatter `title`, `subtitle`, `tags[]`, `coverImages[]`, `order`).
- Fallback no-JS / SEO : chaque slug est aussi rendu en page statique via `/projects/[slug]` (SSG).

## Contraintes (voir `CLAUDE.md`)

- Pas de Tailwind, pas de framework utility-first.
- Pas de valeur hex / px / ms en dur dans un composant — toujours `var(--token-*)`.
- Ne pas modifier `primitives.css` ou `semantic.css` sans concertation.
- Commits en Conventional Commits **français** (`feat:`, `fix:`, `docs:`…).

## Plan de référence

`~/.claude/plans/https-www-figma-com-design-wyrw4dit1mgh-linear-fountain.md` — 10 phases atomiques. Chaque phase doit passer les 4 portes avant commit :

```bash
pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
```
