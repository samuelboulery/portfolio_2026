# OSBar — Power Menu, Navigation Menu & Themes

**Date :** 2026-04-21
**Statut :** **partiellement amendé** par `2026-04-26-mac-lisa-default-theme-design.md`.
Le sous-menu Vue → Thème (Sombre/Clair/Rétro) décrit ici est supprimé : le
portfolio n'expose plus qu'un seul thème (Mac Lisa). PowerMenu, navigation
Fichier, ShutdownScreen et structure générale restent valides.

## Contexte

L'OSBar actuelle est minimaliste : bouton Power (toggle dark↔retro) + nom + horloge. Trois évolutions sont demandées :

1. **Bouton Power** avec dropdown Redémarrer / Éteindre
2. **Barre de menus** style macOS (Fichier, Édition, Vue, Aide) avec dropdowns
3. **Sélecteur de thème** (Dark / Light / Retro) déplacé dans Vue, retiré du bouton Power

## Layout retenu

```
[ ⏻ | Fichier  Édition  Vue  Aide ]          [ 🌙 Thème  10:42 ]
  ↑ PowerMenu   ↑ TopMenuBar                    ↑ inline dans OSBar
```

Deux zones flex (`justify-content: space-between`). Pas de nom au centre. Le thème actif est affiché comme un label inline discret (icône + texte) à droite, directement dans OSBar — pas de composant séparé.

## Composants

### Modifiés

| Fichier | Changement |
|---|---|
| `src/components/os/OSBar/OSBar.tsx` | Intègre `<PowerMenu>` + `<TopMenuBar>` + `<ThemeIndicator>`, retire le toggle direct |
| `src/components/os/OSBar/OSBar.module.css` | Layout 2 zones, tokens `--dropdown-*` |
| `src/hooks/useTheme.ts` | `Theme = "dark" \| "light" \| "retro"`, `toggleTheme` → `setTheme(t: Theme)` |
| `src/components/os/Scene.tsx` | `isShutdown` state, passe `onShutdown`/`onRestart` à OSBar |

### Créés

| Fichier | Rôle |
|---|---|
| `src/components/os/OSBar/PowerMenu.tsx` + `.module.css` | Dropdown Power : Redémarrer / Éteindre |
| `src/components/os/OSBar/TopMenuBar.tsx` + `.module.css` | Menus Fichier / Édition / Vue / Aide avec dropdowns |
| `src/components/os/ShutdownScreen/ShutdownScreen.tsx` + `.module.css` | Écran CRT phosphore post-extinction |

### Tokens à ajouter dans `styles/tokens/components.css`

```css
/* Dropdown menus */
--dropdown-bg: var(--bg-elevated);
--dropdown-border: var(--border-subtle);
--dropdown-radius: var(--radius-m);
--dropdown-shadow: var(--shadow-lg);
--dropdown-item-padding: var(--space-2xs) var(--space-m);
--dropdown-item-hover-bg: var(--bg-hover);
--dropdown-separator-color: var(--border-subtle);
--dropdown-disabled-opacity: 0.35;

/* ShutdownScreen — reprend les primitives boot existantes */
--shutdown-bg: var(--boot-bg);
--shutdown-text: var(--boot-text);
```

## Flux de données

```
Scene
 ├── isShutdown: boolean                     useState
 ├── onShutdown → setIsShutdown(true)
 └── onRestart  → setIsShutdown(false)
                  + sessionStorage.removeItem("boot-done")

OSBar (reçoit onShutdown, onRestart en props)
 ├── activeMenu: string | null               useState local
 ├── PowerMenu   → onShutdown / onRestart
 ├── TopMenuBar
 │    ├── Fichier → windowStore.openWindow(id)
 │    ├── Édition → aria-disabled, style grisé
 │    ├── Vue     → setTheme("dark"|"light"|"retro")
 │    └── Aide    → vide pour l'instant
 └── fermeture menu : useEffect + mousedown sur document

useTheme
 ├── theme: "dark" | "light" | "retro"
 └── setTheme(t) → localStorage.setItem + document.documentElement.dataset.theme = t

AnimatePresence (Scene)
 ├── <BootScreen />       si !bootDone && !isShutdown
 ├── <ShutdownScreen />   si isShutdown
 └── <Desktop />          sinon
```

## Contenu des menus

### Fichier
| Item | Action |
|---|---|
| Accueil | `openWindow("main")` |
| Terminal | `openWindow("terminal")` |
| CV | `openWindow("cv")` |
| — | séparateur |
| Projets > | sous-menu ou actions directes vers ProjectWindows (phase ultérieure) |

### Édition
Désactivé (`aria-disabled="true"`, opacity réduite). Aucune action pour l'instant.

### Vue
| Item | Action |
|---|---|
| Thème Sombre | `setTheme("dark")` |
| Thème Clair | `setTheme("light")` |
| Thème Rétro | `setTheme("retro")` |

Item actif marqué visuellement (checkmark ou dot).

### Aide
Vide pour l'instant.

## ShutdownScreen

- Fond `--shutdown-bg` (#0a0a0a), texte `--shutdown-text` (#33ff33), police monospace
- Lignes affichées :
  ```
  [ shutting down... ]
  Système arrêté.
  Pour relancer : cliquez n'importe où.
  ```
- Clic ou keydown → `onRestart()`
- Animé avec Framer Motion `AnimatePresence` (même pattern que BootScreen)
- `z-index: var(--z-overlay)` (2000)

## Gestion des thèmes — migration

`useTheme` actuel : `toggleTheme()` qui alterne dark ↔ retro.

Migration :
- Remplacer par `setTheme(t: Theme)`
- Conserver la lecture localStorage au mount (anti-FOUC déjà en place dans `layout.tsx`)
- Le script anti-FOUC dans `layout.tsx` gère déjà `"retro"` ; étendre pour `"light"` :
  ```js
  var t = localStorage.getItem('theme');
  if (t === 'retro' || t === 'light') document.documentElement.dataset.theme = t;
  ```

## Tests

### Unit (Vitest + Testing Library)

- `useTheme` — `setTheme` persiste en localStorage et applique `data-theme`
- `PowerMenu` — "Redémarrer" appelle `onRestart`, "Éteindre" appelle `onShutdown`
- `TopMenuBar` — ouverture/fermeture dropdown, "Édition" aria-disabled, clic extérieur ferme, actions Fichier appellent `openWindow`
- `ShutdownScreen` — rendu, clic → `onRestart`, keydown → `onRestart`

### E2E (Playwright, chromium + mobile-safari)

- Clic Power → Éteindre → ShutdownScreen visible → clic → BootScreen → Desktop
- Clic Power → Redémarrer → BootScreen relancé
- Clic Fichier → CV → CVWindow ouverte
- Clic Vue → Thème Clair → `data-theme="light"` sur `<html>`

## Contraintes

- Aucune dépendance nouvelle.
- Tous les styles passent par `components.css` (aucune valeur hex/px en dur dans les modules CSS).
- Commits en Conventional Commits français.
- `pnpm typecheck && pnpm lint && pnpm test:run && pnpm build` vert à la fin de chaque phase.
