# Interface Dark Glass — Design Spec

**Date :** 2026-04-21
**Scope :** Dock, OSBar, Project Folders
**Contexte :** Suite de `window-dark-glass` (fenêtres quasi-noir + glassmorphism). Harmonisation des 3 composants restants avec le fond Rift.

---

## Objectif

Rendre Dock, OSBar et Project Folders visuellement cohérents avec les fenêtres déjà traitées. Chaque composant adopte la même palette Rift (quasi-noir, bleu nuit teinté, bordures `rgba` teintées bleues) tout en gardant sa propre personnalité.

---

## Décisions de design

### Dock — Glass Rift (choix A)

Traitement identique à l'entête de fenêtre : semi-transparent + blur + bordure bleue Rift.

- **Fond dock :** `rgba(10, 15, 40, 0.55)`
- **Blur :** `12px` (via `--dock-blur`, déjà appliqué dans `Dock.module.css`)
- **Bordure dock :** `rgba(60, 80, 160, 0.45)` — 1px solid
- **Fond app icons :** gradient `rgba(15,20,55,0.9) → rgba(8,12,40,0.95)` (stop 27.4%)
- **Bordure app icons :** `rgba(60, 80, 160, 0.35)`
- **Ombre dock :** inchangée (existante)

Le fond Rift filtre à travers le dock, créant une continuité visuelle avec le glassmorphism de l'entête de fenêtre.

### OSBar — Glass Rift (choix A)

Même traitement que le Dock. La barre OS s'intègre au fond sans le masquer.

- **Fond :** `rgba(10, 15, 40, 0.55)`
- **Blur :** `12px` (nouvelle var `--osbar-blur`)
- **Bordure bottom :** `rgba(60, 80, 160, 0.35)` — 1px solid
- **Texte :** inchangé (`--text-primary` / `--text-muted`)

Le `backdrop-filter` doit être déclaré directement dans `OSBar.module.css` (contrainte CSS : `backdrop-filter` ne peut pas être stocké dans une custom property). La valeur du blur est pilotée par `--osbar-blur`.

### Project Folders — Sombre teinté (choix C)

Les folders n'ont pas de blur — ils sont des icônes posées sur le desktop, pas des éléments flottants. Un glassmorphism fort les ferait disparaître. Le choix C leur donne une personnalité indigo désaturée, sombre mais distincte.

- **Fond gradient :** `rgba(15, 18, 50, 0.95) → rgba(8, 10, 35, 0.98)` (stop 27.4%)
- **Bordure :** `rgba(80, 100, 180, 0.35)` — plus subtile que les fenêtres
- **Ombres :** inchangées (existantes)
- **Pas de blur** — cohérent avec leur nature d'icône desktop

---

## Architecture CSS

Trois fichiers modifiés, aucun composant React touché.

| Fichier | Rôle |
|---|---|
| `styles/tokens/components.css` | Mise à jour vars `--dock-*`, `--osbar-*`, `--project-folder-*` |
| `src/components/os/OSBar.module.css` | Ajout `backdrop-filter: blur(var(--osbar-blur))` sur `.bar` |
| `styles/tokens/themes.css` | Overrides `[data-theme="light"]` pour les 3 composants |

Le Dock possède déjà `backdrop-filter: blur(var(--dock-blur))` dans `Dock.module.css` — aucune modification CSS module nécessaire pour le Dock, uniquement la mise à jour des vars.

---

## Vars CSS — delta complet

### components.css — Dock

```css
/* Avant */
--dock-bg: rgba(21, 12, 69, 0.6);
--dock-border: var(--color-indigo-700);
--dock-blur: var(--blur-xs);
--dock-app-bg-1: var(--color-indigo-800);
--dock-app-bg-2: var(--color-indigo-900);
--dock-app-border: var(--color-indigo-700);

/* Après */
--dock-bg: rgba(10, 15, 40, 0.55);
--dock-border: rgba(60, 80, 160, 0.45);
--dock-blur: 12px;
--dock-shadow:
  0 0 0 1px rgba(40, 60, 140, 0.18),
  0 8px 32px rgba(0, 0, 0, 0.6);
--dock-app-bg-1: rgba(15, 20, 55, 0.9);
--dock-app-bg-2: rgba(8, 12, 40, 0.95);
--dock-app-border: rgba(60, 80, 160, 0.35);
```

### components.css — OSBar

```css
/* Avant */
--osbar-bg: var(--bg-elevated);
--osbar-border: var(--border-subtle);

/* Après */
--osbar-bg: rgba(10, 15, 40, 0.55);
--osbar-border: rgba(60, 80, 160, 0.35);
--osbar-blur: 12px;   /* nouvelle var */
```

### components.css — Project Folder

```css
/* Avant */
--project-folder-bg-1: var(--color-indigo-800);
--project-folder-bg-2: var(--color-indigo-900);
--project-folder-border-color: var(--color-indigo-700);

/* Après */
--project-folder-bg-1: rgba(15, 18, 50, 0.95);
--project-folder-bg-2: rgba(8, 10, 35, 0.98);
--project-folder-border-color: rgba(80, 100, 180, 0.35);
```

### OSBar.module.css — ajout backdrop-filter

```css
.bar {
  /* ... existant ... */
  backdrop-filter: blur(var(--osbar-blur));
  -webkit-backdrop-filter: blur(var(--osbar-blur));
}
```

### themes.css — overrides [data-theme="light"]

```css
/* Dock — fond blanc translucide */
--dock-bg: rgba(255, 255, 255, 0.72);
--dock-border: rgba(0, 0, 0, 0.12);
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

---

## Thème retro — vérification

Le thème `[data-theme="retro"]` surcharge `--window-bar-bg` et `--window-bg` avec des valeurs explicites. Il faudra vérifier à l'implémentation qu'il n'y a pas de régression visuelle sur Dock/OSBar/Folders. Si les vars retro ne surchargent pas ces composants, le thème retro héritera des nouvelles valeurs Rift — ce qui est acceptable (le retro Mac Lisa n'a pas de dock ni d'osbar spécifiques).

---

## Tests

Changement purement CSS — pas de tests unitaires. Vérification par :

1. `pnpm typecheck && pnpm lint && pnpm build` — tous verts
2. Contrôle visuel dev server :
   - Dock : glassmorphism visible, lueurs Rift filtrent à travers
   - OSBar : glassmorphism cohérent avec Dock et entête fenêtre
   - Folders : sombres teintés, distincts du fond Rift
   - Thème light : vérifier via DevTools → localStorage → `theme: "light"`
   - Thème retro : aucune régression
   - Safari : `-webkit-backdrop-filter` sur OSBar fonctionne
