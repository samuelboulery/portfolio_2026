# Design — Background Rift & Suppression des radius

**Date :** 2026-04-21  
**Statut :** **superseded** par `2026-04-26-mac-lisa-default-theme-design.md`.
Le concept Rift (fond indigo + taches crimson/ambre) est abandonné au profit
du thème Mac Lisa 1-bit pur (B&W, dither pattern bureau).

---

## Contexte

L'UI actuelle s'appuie sur un dégradé indigo/violet trop prononcé et peu distinctif. L'objectif est de passer à une esthétique **tech sombre** : fond quasi-noir avec trois taches de couleur (bleu nuit dominant, cramoisi gauche, ambre subtil) qui oscillent très légèrement. Le design de référence est le nœud Figma `239:2173` (Portfolio-2026), dont le fond est `#050215` avec accents crimson `#600627` et zéro radius. L'animation doit être imperceptible au premier coup d'œil — une respiration, pas un effet.

---

## Palette Rift

| Rôle | Couleur | Position |
|---|---|---|
| Base | `#010208` | fond plat |
| Orbe bleu nuit | `rgba(0, 25, 70, 0.75)` | 80% 20% (haut-droite) |
| Orbe cramoisi | `rgba(70, 5, 20, 0.55)` | 10% 80% (bas-gauche) |
| Orbe ambre | `rgba(50, 35, 0, 0.40)` | 60% 90% (bas-centre) |

---

## Architecture des changements

### 1. `styles/tokens/components.css`

**a) `--desktop-bg`** — remplacer le dégradé indigo par :
```css
--desktop-bg: radial-gradient(ellipse 70% 55% at 80% 20%, rgba(0, 25, 70, 0.75) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 10% 80%, rgba(70, 5, 20, 0.55) 0%, transparent 55%),
              radial-gradient(ellipse 55% 45% at 60% 90%, rgba(50, 35, 0, 0.40) 0%, transparent 50%),
              #010208;
```

**b) Radius composants** — toutes les vars radius component → `0` :
```css
--window-radius:                    0;
--dock-radius:                      0;
--dock-app-radius:                  0;
--button-radius:                    0;
--project-folder-radius:            0;
--project-folder-outline-radius:    0;
--project-folder-name-active-radius:0;
--project-cover-radius:             0;
```

**c) `@keyframes riftShift`** — animation de l'orbe :
```css
@keyframes riftShift {
  0%   { opacity: 0.80; transform: scale(1)    translate(0, 0); }
  40%  { opacity: 1;    transform: scale(1.04) translate(-1.5%, 0.5%); }
  80%  { opacity: 0.85; transform: scale(0.97) translate(1%, -0.5%); }
  100% { opacity: 1;    transform: scale(1.01) translate(-0.5%, 1%); }
}
```

### 2. `src/components/os/Desktop.module.css`

Ajouter un pseudo-élément `::before` sur `.desktop` qui porte le fond animé :
```css
.desktop {
  /* existant — background: var(--desktop-bg) reste pour fallback */
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
  z-index: var(--z-desktop); /* s'assure que le contenu passe au-dessus du ::before */
}
```

Le fond de `.desktop` devient `#010208` (couleur plate), et `::before` porte le dégradé animé.

### 3. CSS inline à vérifier

`OSBar.module.css` utilise `border-radius: var(--radius-xs)` en dur (pas via une var composant). Ajouter une var `--osbar-icon-radius: 0` dans `components.css` et l'appliquer dans `OSBar.module.css`.

---

## Ce qu'on ne modifie pas

- `styles/tokens/primitives.css` — les valeurs `--radius-*` primitifs restent intactes
- `styles/tokens/semantic.css` — les `--bg-*` sémantiques restent (fenêtres et surfaces gardent leur couleur indigo actuelle, ce qui crée un bon contraste contre le fond quasi-noir)
- Thème `retro` — déjà à radius 0, non impacté
- Thème `light` — ses radius passeront aussi à 0 ; si problème, on override dans `[data-theme="light"]` de `themes.css`. **Ajouter aussi** `--desktop-bg: var(--bg-base)` dans `[data-theme="light"]` pour éviter que le Rift gradient s'applique en mode clair (même traitement que le retro).

---

## Périmètre animation

- Durée : `16s`
- Easing : `ease-in-out`
- Mode : `infinite alternate`
- Amplitude max : `scale(1.04)`, `translate(±1.5%, ±0.5%)`, `opacity` entre 0.80 et 1.00
- Respect de `prefers-reduced-motion` : ajouter `@media (prefers-reduced-motion: reduce)` → `animation: none`

---

## Vérification

```bash
pnpm typecheck   # doit être vert
pnpm lint        # doit être vert
pnpm test:run    # doit être vert
pnpm build       # doit être vert
```

Contrôle visuel :
1. Ouvrir `localhost:3000` — fond quasi-noir avec teintes Rift, animation subtile visible
2. Vérifier zéro radius sur : fenêtres, dock, boutons, folders, cover images
3. Basculer thème retro → radius déjà 0, non régressé
4. Basculer thème light → radius 0, vérifier lisibilité
5. DevTools → `prefers-reduced-motion: reduce` → animation s'arrête
