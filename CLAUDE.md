# Portfolio 2026 — Samuel Boulery

Portfolio personnel sous forme d'environnement macOS-like dans le navigateur : fenêtres draggables, dock, barre OS, terminal cliquable révélant des études de cas projet. System Designer & Token Architect (EDF/CBTW).

## Architecture

Scène unique (`/`) composant : `Desktop` (gradient) + `OSBar` (top) + `Dock` (bottom) + plusieurs `Window` flottantes. Les projets sont accessibles via un `TerminalWindow` cliquable OU les `ProjectFolder` du desktop, et s'ouvrent dans une `ProjectWindow` qui lit du MDX statique.

```
app/page.tsx
├── OSBar              ← date live, nom, power icon
├── Desktop            ← fond radial/linear
│   ├── FoldersGrid    ← 5 ProjectFolder (EDF, Mazars, Bonum, Greenweez, Portfolio)
│   └── WindowsLayer   ← MainWindow / SubtitleWindow / TerminalWindow / ImageWindow / CVWindow / ProjectWindow
└── Dock               ← 6 apps, indicateurs actifs liés au windowStore
```

**Stack :**
- Framework : Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict
- Styling : CSS Modules + CSS custom properties (pas de Tailwind — tokens scopés lisibles)
- State fenêtres : Zustand (focus, position, z-index, open/minimized)
- Drag : framer-motion + persistance `sessionStorage`
- Contenu projets : MDX statique (`content/projects/*.mdx`) via `@next/mdx`
- Lint/format : Biome (pas ESLint/Prettier)
- Tests : Vitest (unit) + Playwright (e2e desktop + mobile-safari)
- Package manager : **pnpm**

## Commandes clés

```bash
# Développement
pnpm dev             # démarre Next.js avec Turbopack sur :3000
pnpm build           # build production
pnpm start           # serve le build

# Qualité
pnpm typecheck       # tsc --noEmit
pnpm lint            # biome check .
pnpm lint:fix        # biome check --write .
pnpm format          # biome format --write .

# Tests
pnpm test            # vitest watch
pnpm test:run        # vitest run (CI)
pnpm test:ui         # vitest UI
pnpm test:e2e        # playwright chromium + mobile-safari
pnpm test:e2e:ui     # playwright UI
```

## Design system — hiérarchie stricte à 3 couches

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

**Test de validité** : ajouter `<html data-theme="light">` avec overrides primitives doit flipper toute l'UI sans toucher un seul composant.

## Conventions

- **Tokens d'abord** : tout style nouveau utilise une var `components.css`. Si elle n'existe pas, l'ajouter avant le CSS module.
- **Composants CSS Modules** : `Component.tsx` + `Component.module.css` colocalisés.
- **Structure src/** : `src/components/{os,window,windows,folder,ui,typography}/`, `src/stores/`, `src/hooks/`, `src/lib/`, `src/content/`.
- **Path alias** : `@/*` → `./src/*`.
- **TypeScript strict** : pas de `any`, `unknown` + narrowing aux frontières.
- **Commits** : Conventional Commits en **français** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
- **Commentaires** : défaut = aucun. N'écrire que si le *pourquoi* est non-évident.

## Contraintes (ne jamais faire)

- **Ne jamais ajouter Tailwind** ni autre framework utility-first — la hiérarchie de tokens est le design system.
- **Ne jamais modifier `styles/tokens/primitives.css` ou `semantic.css` sans concertation** — ce sont les sources de vérité du thème. Les changements composants vont dans `components.css`.
- **Ne jamais mettre de valeurs hex/px en dur dans un composant** — passer par une var CSS.
- **Ne jamais installer de dépendance sans demander** (règle utilisateur globale).
- **Ne jamais push --force**, ne pas skip les hooks git.
- **Ne pas toucher** `next-env.d.ts`, `.next/`, `node_modules/`, `pnpm-lock.yaml` (lock ok à commit).
- **Ne pas ajouter d'attribution IA dans les commits** (désactivé globalement).

## Variables d'environnement

Aucune pour l'instant — le projet est statique (MDX + SSG). Un éventuel `.env.local` sera listé ici le jour où on branche analytics ou form de contact.

## Équipe & process

Solo. Plan de référence : `~/.claude/plans/https-www-figma-com-design-wyrw4dit1mgh-linear-fountain.md` (10 phases atomiques, chacune committable). Design source : Figma (accès via MCP `claude_ai_Figma`).

À la fin de chaque phase : `pnpm typecheck && pnpm lint && pnpm test:run && pnpm build` doit être vert.

## graphify

Graphe de connaissance dans `graphify-out/` (non versionné — reconstruit localement).

**Avant d'explorer le code en profondeur** : lire `graphify-out/GRAPH_REPORT.md`, puis `/graphify query "<question>"` pour les questions transverses.

**Après changements** :
- Commits code → hook post-commit auto (extraction AST, pas de LLM)
- Docs / ADR / nouvelle phase → `/graphify . --update` manuel
