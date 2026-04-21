# Window Dark Glass — Design Spec

## Contexte

Le fond de scène est désormais le palette Rift : quasi-noir `#010208` animé avec des lueurs bleu nuit (haut-droite), cramoisi (bas-gauche) et ambre (bas-centre). Les fenêtres actuelles ont un dégradé indigo-800/900 trop saturé et trop clair par rapport au fond. Ce redesign les harmonise : corps quasi-noir, entête glassmorphism, bordure teintée Rift.

## Décisions de design

### Entête de fenêtre (`--window-bar-bg`)

- **Valeur :** `rgba(10, 15, 40, 0.55)` + `backdrop-filter: blur(12px)`
- **Effet :** glassmorphism doux — les lueurs Rift transparaissent légèrement à travers l'entête, donnant une sensation de profondeur. Lisibilité conservée (55% opaque).
- **Accessibilité :** `backdrop-filter` est une amélioration progressive — sans support, l'entête reste semi-transparente et lisible.

### Corps de fenêtre (`--window-bg`, `--window-bg-gradient`)

- **Valeur :** `rgba(4, 6, 18, 0.96)` — quasi-noir opaque
- **Effet :** contraste maximum avec le contenu (texte, terminal, prose). Rupture nette entête/corps qui renforce la hiérarchie visuelle.
- **`--window-bg-gradient` :** remplacé par la même valeur plate (`rgba(4, 6, 18, 0.96)`) — plus de dégradé indigo, fond uniforme sombre.

### Bordure (`--window-border`)

- **Valeur :** `rgba(60, 80, 160, 0.45)` — teinte bleue Rift
- **Effet :** délimite la fenêtre avec une couleur cohérente avec le glow bleu nuit du fond. Subtile mais identifiable.

### Ombre (`--window-shadow`)

- **Valeur :** `0 0 0 1px rgba(40, 60, 140, 0.18), 0 8px 32px rgba(0, 0, 0, 0.6)`
- **Effet :** double couche — un halo bleu Rift très discret autour du périmètre + ombre portée sombre profonde. Renforce l'impression de "flottaison" de la fenêtre sur le fond Rift.

### Fenêtre non-focalisée

- L'ombre réduite existante (`var(--shadow-m)`) est remplacée par une version atténuée du même glow : `0 0 0 1px rgba(40, 60, 140, 0.08), 0 4px 16px rgba(0, 0, 0, 0.5)`.

## Architecture

### Fichiers modifiés

| Fichier | Rôle |
|---|---|
| `styles/tokens/components.css` | Mise à jour des vars `--window-*` |
| `styles/tokens/themes.css` | Overrides `[data-theme="light"]` pour les nouvelles vars |

### Fichiers non modifiés

- `src/components/window/Window.module.css` — consomme déjà `var(--window-bg-gradient, var(--window-bg))` et `var(--window-border)` : aucun changement nécessaire.
- `src/components/window/WindowBar.module.css` — consomme déjà `var(--window-bar-bg)` : le `backdrop-filter` sera ajouté **dans ce fichier** via une règle CSS dédiée (car `backdrop-filter` n'est pas une custom property transmissible via var).

### Point d'attention : `backdrop-filter` dans WindowBar

`backdrop-filter` ne peut pas être passé via une CSS custom property. Il doit être déclaré directement dans `WindowBar.module.css` sur `.bar`. On crée une var `--window-bar-blur` (valeur `12px`) dans `components.css` pour documenter l'intention, mais la règle `backdrop-filter: blur(var(--window-bar-blur))` est dans le CSS module.

### Thème `retro`

Déjà complet : `--window-bar-bg: #1a1a1a` et `--window-bg: #f5f0e8` — overrides explicites qui prennent précédence. Aucune régression attendue.

### Thème `light`

Ajouter dans `[data-theme="light"]` :
```css
--window-bg: rgba(255, 255, 255, 0.96);
--window-bg-gradient: rgba(255, 255, 255, 0.96);
--window-bar-bg: rgba(240, 240, 248, 0.72);
--window-border: rgba(0, 0, 0, 0.14);
--window-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.12);
```

## Contraintes

- Aucune valeur hex/rgba en dur dans les CSS Modules — tout passe par les vars `--window-*`.
- Exception documentée : `backdrop-filter: blur(var(--window-bar-blur))` dans `WindowBar.module.css` (impossibilité technique des custom properties pour les fonctions de filtre).
- Biome : doubles guillemets, pas de trailing zéros inutiles (`0.55` pas `0.550`).
