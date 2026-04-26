# Mac Lisa — Thème par défaut (et unique pour l'instant)

**Date :** 2026-04-26
**Statut :** Implémenté en 12 phases atomiques.
**Plan d'origine :** `~/.claude/plans/image-3-image-4-elegant-spring.md`

## Contexte

Le portfolio expose actuellement 3 thèmes via `[data-theme]` (dark, light, retro). Samuel veut basculer en thème *Mac Lisa* pixel-perfect 1-bit comme **seul thème actif**, et supprimer les autres. L'infrastructure `useTheme` + `data-theme` est conservée pour réintroduire d'autres thèmes plus tard (la mémoire `project_theme_phosphor.md` indique déjà un futur thème CRT vert).

Références visuelles fournies (Apple Lisa Office System & Mac System 6) :
- B&W pur (#000 / #FFF)
- Title bars rayées (6 lignes horizontales 1px, encart titre blanc centré)
- Bureau 50% dithered grey (pixel pattern)
- Police *Chicago* (l'identité typographique du Mac original)
- Ombres = offset 2px noir, zéro blur, zéro radius
- Folders = chemise tabbed pixel art

Décisions cadrées avec l'utilisateur :

| Axe | Choix |
|---|---|
| Fidélité | **Pixel-perfect 1-bit** (pas de réinterprétation moderne) |
| Police | **Chicago-style** (ChicagoFLF libre, à installer dans `public/fonts/chicago/`) |
| Architecture | **`useTheme` + `[data-theme="lisa"]` conservés**, sous-menu Vue→Thème supprimé |
| Scope | **Complet** : OSBar, Window, Dock, Folder, Dropdown, Terminal, Tag, Button + BootScreen + ShutdownScreen + cover images grayscale |
| Lecture MDX | **Chicago partout**, y compris paragraphes des projets |
| Bureau dither | **SVG inline en data-URI** dans `--color-lisa-grey-50` |

## Vue d'ensemble de l'architecture

Hiérarchie 4 couches conservée intégralement (`primitives → semantic → components → themes`). Lisa devient les valeurs **du `:root` sémantique par défaut**. Le sélecteur `[data-theme="lisa"]` réplique le `:root` (no-op de cohérence pour inspection / future bascule). Les anciens sélecteurs `[data-theme="dark"|"light"|"retro"]` sont supprimés. Aucun composant TSX/CSS Module n'a besoin de connaître Lisa : ils continuent de consommer leurs vars `--*` de `components.css`.

**Points structurels (au-delà des tokens) :**
1. `WindowBar` doit afficher le pattern *6 stripes + encart titre blanc* — implémenté via `background-image` + pseudo `::before` ou un `<div>` dédié.
2. `Desktop` remplace son radial-gradient par le pattern dithered (token de bureau).
3. `BootScreen` est réécrit (Welcome to Macintosh + Happy Mac SVG).
4. `ShutdownScreen` est réécrit (B&W safe-to-shutdown).
5. `ProjectFolder` reçoit une icône SVG redessinée (chemise Lisa pixel art).
6. Cover images projets reçoivent un filtre CSS `grayscale(100%) contrast(1.15)`.

## Fichiers critiques

### À modifier

| Fichier | Type de changement |
|---|---|
| `styles/tokens/primitives.css` | **Ajout** : couleurs Lisa, `--font-chicago`, ombre/border Lisa, pattern SVG `--color-lisa-grey-50`. Ne rien supprimer. |
| `styles/tokens/semantic.css` | **Réécriture du `:root`** : valeurs Lisa (B&W, Chicago, accents = noir). |
| `styles/tokens/components.css` | **Réassignation des vars existantes** en valeurs B&W (window, dock, osbar, dropdown, button, folder, tag, scrollbar, terminal, cv, project, boot, shutdown). |
| `styles/tokens/themes.css` | **Réécriture totale** : suppression `dark/light/retro`, garder un `[data-theme="lisa"]` no-op + commentaire "futur thème ici". |
| `styles/fonts.css` | Ajout des `@font-face` Chicago. |
| `src/app/layout.tsx` | Supprimer ou simplifier le script anti-FOUC (un seul thème → pas de FOUC). |
| `src/app/globals.css` | `color-scheme: light` (Lisa = fond blanc). |
| `src/hooks/useTheme.ts` | `Theme = "lisa"`, `VALID_THEMES = ["lisa"]`, default `"lisa"`. `setTheme` reste fonctionnel pour usage futur. |
| `src/components/os/OSBar/OSBar.tsx` | Supprimer `THEME_LABELS`, `ThemeIndicator` inline si présent, et toute mention de "Sombre/Clair/Rétro". |
| `src/components/os/OSBar/TopMenuBar.tsx` | Supprimer `THEME_ITEMS`, l'item *Vue → Thème* et son sous-menu. Garder Fichier / Édition (disabled) / Aide. |
| `src/components/window/WindowBar/WindowBar.tsx` + `.module.css` | Ajouter le pattern de stripes horizontales + encart titre blanc centré. |
| `src/components/os/Desktop.tsx` + `Desktop.module.css` | Remplacer le `radial-gradient` par `background: var(--desktop-bg)` qui pointe vers le pattern dithered. |
| `src/components/os/BootScreen/BootScreen.tsx` + `.module.css` | **Réécriture** : "Welcome to Macintosh" + Happy Mac SVG (à créer dans `src/components/os/icons/HappyMac.tsx`). |
| `src/components/os/ShutdownScreen/ShutdownScreen.tsx` + `.module.css` | **Réécriture** : fond blanc, texte noir Chicago centré. |
| `src/components/folder/ProjectFolder/*` | Remplacer SVG icône par dossier Lisa pixel (chemise tabbed). |
| `src/components/windows/ProjectWindow.module.css` (et/ou MDX components) | Filtre `grayscale(100%) contrast(1.15)` sur les `img` cover. |
| `tests/unit/useTheme.test.ts` | Adapter aux nouvelles valeurs (`"lisa"` only). |
| `tests/unit/OSBar/TopMenuBar.test.tsx` | Retirer assertions sur le sous-menu Thème. |
| `tests/e2e/osbar.spec.ts` | Retirer le scénario *Vue → Thème Clair → `data-theme="light"`*. |

### À créer

| Fichier | Rôle |
|---|---|
| `public/fonts/chicago/ChicagoFLF.ttf` (ou `.woff2`) | Police Chicago libre. |
| `src/components/os/icons/HappyMac.tsx` | SVG inline 64×64 pixel art du Happy Mac. |
| `src/components/folder/ProjectFolder/icons/LisaFolder.tsx` | SVG inline du dossier Lisa tabbed (si remplacement du SVG actuel). |
| `docs/superpowers/specs/2026-04-26-mac-lisa-default-theme-design.md` | Spec design final (recopiée depuis ce plan une fois sortie du plan mode). |

### À archiver / marquer obsolètes

| Fichier | Raison |
|---|---|
| `docs/superpowers/specs/2026-04-21-boot-screen-design.md` | Superseded par Lisa BootScreen. |
| `docs/superpowers/plans/2026-04-21-boot-screen.md` | Idem. |
| `docs/superpowers/specs/2026-04-21-background-rift-theme-design.md` | Concept "rift" abandonné, Lisa utilise dither. |
| `docs/superpowers/plans/2026-04-21-background-rift-radius-zero.md` | Idem. |
| `docs/superpowers/specs/2026-04-21-osbar-power-menu-themes-design.md` | **Partiellement** obsolète : sous-menu Thème supprimé ; PowerMenu / TopMenuBar / ShutdownScreen restent. Ajouter une note d'amendement. |
| `docs/superpowers/plans/2026-04-21-osbar-power-menu-themes.md` | Idem. |

## Tokens — détail technique

### primitives.css — ajouts

```css
/* Couleurs Mac Lisa 1-bit */
--color-lisa-black: #000000;
--color-lisa-white: #FFFFFF;
--color-lisa-grey-50: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2'><rect width='1' height='1' fill='%23000000'/><rect x='1' y='1' width='1' height='1' fill='%23000000'/></svg>");

/* Police Chicago authentique */
--font-chicago: "ChicagoFLF", "ChiKareGo", "Silkscreen", -apple-system, monospace;

/* Bordures et ombres 1-bit */
--border-width-lisa: 1px;
--border-radius-lisa: 0;
--shadow-lisa: 2px 2px 0 #000;
```

### semantic.css — `:root` réécrit en Lisa

```css
:root {
  /* Backgrounds */
  --bg-base: var(--color-lisa-white);   /* fond brut, surchargé par --desktop-bg */
  --bg-elevated: var(--color-lisa-white);
  --bg-surface: var(--color-lisa-white);
  --bg-surface-alt: var(--color-lisa-white);
  --bg-hover: var(--color-lisa-black);
  --bg-active: var(--color-lisa-black);
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* Borders — toujours noires, toujours 1px */
  --border-default: var(--color-lisa-black);
  --border-subtle: var(--color-lisa-black);
  --border-strong: var(--color-lisa-black);
  --border-accent: var(--color-lisa-black);
  --border-width-default: 1px;

  /* Text */
  --text-primary: var(--color-lisa-black);
  --text-secondary: var(--color-lisa-black);
  --text-muted: var(--color-lisa-black);
  --text-decorative: var(--color-lisa-black);
  --text-disabled: rgba(0, 0, 0, 0.35);   /* seul écart au pur 1-bit */
  --text-on-accent: var(--color-lisa-white);

  /* Accents — pas de couleur, c'est du noir + soulignement */
  --accent-primary: var(--color-lisa-black);
  --accent-secondary: var(--color-lisa-black);
  --accent-link: var(--color-lisa-black);
  --accent-success: var(--color-lisa-black);
  --accent-brand: var(--color-lisa-black);
  --accent-muted: var(--color-lisa-black);
  --focus-ring-color: var(--color-lisa-black);

  /* Typographie */
  --font-display: var(--font-chicago);
  --font-ui: var(--font-chicago);
}
```

### components.css — patches B&W (extrait, liste exhaustive en Phase 2)

```css
/* Window */
--window-bg: #FFF;
--window-radius: 0;
--window-border: #000;
--window-border-width: 1px;
--window-shadow: var(--shadow-lisa);
--window-bar-bg: #FFF;                     /* le stripe pattern est appliqué via background-image dans le module */
--window-bar-stripes: repeating-linear-gradient(
  to bottom, #000 0 1px, #FFF 1px 3px
);
--window-bar-title-bg: #FFF;               /* encart blanc centré sur les rayures */
--window-bar-title-color: #000;
--window-bar-close: #000;
--window-bar-reduce: #000;
--window-bar-expand: #000;
--window-bar-dot-radius: 0;

/* Desktop — pattern dithered */
--desktop-bg: var(--color-lisa-grey-50);
--desktop-bg-size: 2px 2px;

/* Dock — fond blanc, bordure noire */
--dock-display: flex;                      /* Lisa avait des "icons à plat" en bas, on garde le dock */
--dock-bg: #FFF;
--dock-border: #000;
--dock-border-width: 1px;
--dock-radius: 0;
--dock-shadow: var(--shadow-lisa);

/* OSBar — barre de menus Mac classique */
--osbar-bg: #FFF;
--osbar-border: #000;
--osbar-border-width: 1px;

/* Dropdown — bg blanc, hover invert */
--dropdown-bg: #FFF;
--dropdown-border: #000;
--dropdown-radius: 0;
--dropdown-shadow: var(--shadow-lisa);
--dropdown-item-hover-bg: #000;
--dropdown-item-hover-color: #FFF;

/* Button — bordure noire, hover invert */
--button-outlined-border: #000;
--button-outlined-text: #000;
--button-outlined-hover-bg: #000;
--button-outlined-hover-text: #FFF;
--button-plain-bg: #000;
--button-plain-text: #FFF;
--button-plain-hover-bg: #FFF;
--button-plain-hover-text: #000;
--button-radius: 0;

/* Folder */
--project-folder-bg-1: #FFF;
--project-folder-bg-2: #FFF;
--project-folder-border-color: #000;
--project-folder-radius: 0;
--project-folder-shadow: var(--shadow-lisa);
--project-folder-name-color: #000;
--project-folder-name-active-bg: #000;
--project-folder-outline-color: #000;
--project-folder-outline-radius: 0;

/* Terminal — fond blanc, texte noir Chicago */
--terminal-bg: #FFF;
--terminal-text: #000;
--terminal-link: #000;
--terminal-link-hover: #000;
/* hover via text-decoration: underline; aucune couleur */

/* Tag */
--tag-bg: #FFF;
--tag-border: #000;
--tag-text: #000;
--tag-radius: 0;

/* Scrollbar Lisa */
--scrollbar-width: 16px;
--scrollbar-thumb: #FFF;
--scrollbar-thumb-border: #000;
--scrollbar-track: var(--color-lisa-grey-50);
--scrollbar-radius: 0;

/* Boot/Shutdown */
--boot-bg: #FFF;
--boot-text: #000;
--shutdown-bg: #FFF;
--shutdown-text: #000;
```

## Phases d'implémentation (atomiques, chacune committable)

Chaque phase termine par `pnpm typecheck && pnpm lint && pnpm test:run && pnpm build` vert. Phases ≥ 5 ajoutent `pnpm test:e2e`.

### Phase 1 — Polices Chicago
- Télécharger ChicagoFLF (licence libre, vérifier la licence avant commit) dans `public/fonts/chicago/`. Si pas trouvée libre, fallback sur ChiKareGo (libre confirmée).
- Ajouter `@font-face` dans `styles/fonts.css`.
- Ajouter `--font-chicago` dans `primitives.css`.
- Tester dans une page de démo (visuel uniquement, pas d'effet UI à ce stade).
- Commit : `feat: ajoute la police Chicago pour le thème Lisa`

### Phase 2 — Tokens Lisa
- Ajouter primitives Lisa dans `primitives.css`.
- Réécrire `:root` de `semantic.css` en valeurs Lisa.
- Réassigner toutes les vars de `components.css` en valeurs B&W (mapping exhaustif fait à partir du fichier actuel).
- Réécrire `themes.css` : supprimer dark/light/retro, ajouter `[data-theme="lisa"]` no-op.
- À ce stade, l'app entière passe en B&W *sans toucher un composant* — c'est le "test de validité" du design system.
- Tests `useTheme` adaptés à `"lisa"`.
- Commit : `feat: bascule les tokens en thème Mac Lisa`

### Phase 3 — useTheme & layout
- `Theme = "lisa"`, `VALID_THEMES = ["lisa"]`, default `"lisa"`.
- Simplifier le script anti-FOUC dans `layout.tsx` (script supprimé ou réduit à `data-theme="lisa"`).
- `globals.css` : `color-scheme: light;`.
- Commit : `refactor: useTheme accepte uniquement Lisa pour le moment`

### Phase 4 — Suppression du sous-menu Vue → Thème
- Retirer `THEME_ITEMS`, l'item Vue → Thème de `TopMenuBar.tsx`.
- Retirer `THEME_LABELS` et tout `ThemeIndicator` inline de `OSBar.tsx`.
- Retirer les tests unitaires + e2e correspondants.
- Commit : `refactor: retire le sous-menu Vue Thème (un seul thème actif)`

### Phase 5 — WindowBar à rayures
- Modifier `WindowBar.tsx` + `.module.css` pour rendre le pattern stripes + encart titre.
- Implémentation : `background-image: var(--window-bar-stripes)` sur la barre + un `<span>` titre absolument positionné avec `background: #FFF; padding: 0 var(--space-s);`.
- Test unitaire : la barre rend bien un titre lisible (pas occluded par les stripes).
- E2E : screenshot baseline mise à jour.
- Commit : `feat: WindowBar rayures + encart titre style Mac Lisa`

### Phase 6 — Desktop dithered
- `Desktop.module.css` : `background: var(--color-lisa-grey-50) repeat; background-size: var(--desktop-bg-size);`.
- Suppression du radial-gradient.
- Test E2E : screenshot baseline.
- Commit : `feat: bureau pattern dithered 50% pixel`

### Phase 7 — BootScreen Welcome to Macintosh
- Créer `src/components/os/icons/HappyMac.tsx` (SVG 64×64 pixel art).
- Réécrire `BootScreen.tsx` + `.module.css` : fond blanc, Happy Mac centré, "Welcome to Macintosh" en Chicago 24px sous l'icône, Framer Motion fade-in séquencé identique au comportement actuel.
- Tests unitaires : Happy Mac visible, texte affiché.
- E2E : screenshot baseline.
- Commit : `feat: BootScreen Welcome to Macintosh + Happy Mac`

### Phase 8 — ShutdownScreen B&W
- Réécrire `ShutdownScreen.tsx` + `.module.css` : fond blanc, "It is now safe to turn off your computer." en Chicago 18px centré, "Cliquez n'importe où pour redémarrer." en Chicago 12px en bas.
- Tests adaptés.
- Commit : `feat: ShutdownScreen blanc/noir style Lisa`

### Phase 9 — ProjectFolder pixel art
- Créer `LisaFolder.tsx` SVG (chemise tabbed pixel).
- Remplacer le SVG actuel dans `ProjectFolder`.
- Tests unitaires inchangés (SVG remplacé, comportement identique).
- Commit : `feat: ProjectFolder en chemise Lisa pixel art`

### Phase 10 — Cover images grayscale
- Ajouter `filter: grayscale(100%) contrast(1.15);` sur `.cover img` dans `ProjectWindow.module.css` (ou équivalent MDX).
- Vérifier visuellement sur les 5 projets.
- Commit : `style: cover images projets en grayscale haute contraste`

### Phase 11 — Tests & E2E mis à jour
- Vérifier que les 3 golden paths E2E passent toujours :
  1. Click terminal "curriculum_vitae.html" → CV s'ouvre
  2. Click folder "EDF" → ProjectWindow EDF s'ouvre
  3. Drag MainWindow → position persiste après reload
- Mettre à jour les snapshots / baselines visuelles.
- Commit : `test: snapshots mis à jour pour le thème Lisa`

### Phase 12 — Cleanup & archivage specs
- Supprimer assets / tokens / vars devenus orphelins (vérifier avec `pnpm knip` si installé, sinon grep manuel).
- Ajouter notes "Superseded by Lisa" en haut des specs `2026-04-21-boot-screen-design.md`, `2026-04-21-background-rift-theme-design.md`, et amendement sur `osbar-power-menu-themes-design.md`.
- Recopier ce plan en spec final dans `docs/superpowers/specs/2026-04-26-mac-lisa-default-theme-design.md`.
- Commit : `chore: nettoyage post-bascule Lisa et archivage specs obsolètes`

## Vérification end-to-end

Après Phase 12, vérifier manuellement dans le navigateur :

1. **Boot** — `pnpm dev`, ouvrir `localhost:3000` après vidange `sessionStorage` → BootScreen Lisa avec Happy Mac et "Welcome to Macintosh".
2. **Bureau** — fond dithered visible, OSBar en haut blanche avec bordure noire 1px, dock en bas blanc.
3. **Police** — texte de l'OSBar et folders en Chicago (vérifier dans devtools Computed → font-family).
4. **WindowBar** — ouvrir une fenêtre (CV, Terminal, Project), voir les 6 stripes + encart titre blanc centré.
5. **Dropdown** — cliquer sur Fichier → menu blanc, hover noir/blanc inversé. Vérifier *absence* du sous-menu Vue → Thème.
6. **Power → Éteindre** → ShutdownScreen blanc avec texte Chicago noir.
7. **Click → Redémarrer** → BootScreen relancé, Welcome to Macintosh.
8. **Folder EDF** → icône chemise Lisa, label Chicago, ouverture ProjectWindow avec cover image en grayscale.
9. **Theme switching côté code** — `document.documentElement.dataset.theme = ""` (vide) ne casse rien, `= "lisa"` non plus.
10. **Pipeline qualité** : `pnpm typecheck && pnpm lint && pnpm test:run && pnpm test:e2e && pnpm build` tous verts.

## Risques et mitigations

| Risque | Mitigation |
|---|---|
| Police Chicago libre introuvable | Fallback sur ChiKareGo (libre, déjà identifiée). Si aucune libre confirmée, garder Silkscreen en attendant et ouvrir un ticket. |
| Lisibilité MDX (paragraphes longs en Chicago) | Tailles 16-18px, line-height 1.6, max-width 60ch. Si retour utilisateur négatif, ouvrir ticket pour mode "comfort reading". |
| Stripe pattern qui anti-aliase à certains zooms | Utiliser `image-rendering: pixelated` sur le fond stripe + tester aux zooms 100/125/150/200%. |
| Cover images projets illisibles en grayscale | Tester sur les 5 projets avant merge. Ajuster le `contrast` si besoin (range 1.0–1.3). |
| Régression e2e sur baselines visuelles | Mettre à jour les snapshots intentionnellement, vérifier diff manuellement avant commit. |
| `useTheme.setTheme` devient un no-op temporaire | Documenter dans le JSDoc ; restera utile dès le 2e thème. |

## Hors scope (à part)

- Easter egg phosphor green (mémoire `project_theme_phosphor.md`) — futur thème indépendant.
- Curseur 1-bit pixelisé — peut venir en Phase 13.
- Sons système Lisa (boot chime, alert beep) — hors portfolio statique.
- Réécriture ProjectWindow MDX en bitmap — pas demandé.
