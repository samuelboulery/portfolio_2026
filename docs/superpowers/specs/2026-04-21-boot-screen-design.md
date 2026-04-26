# Boot Screen — Spec Design

**Date :** 2026-04-21
**Statut :** **superseded** par `2026-04-26-mac-lisa-default-theme-design.md` (Phase 7).
Le BootScreen CRT phosphore vert décrit ci-dessous est remplacé par
l'écran « Welcome to Macintosh » blanc/noir avec Happy Mac.

## Contexte

Le portfolio s'ouvre directement sur le desktop sans aucune transition. Ajouter un écran de boot simulant l'allumage de l'OS renforce l'immersion de l'expérience macOS-like et plante le décor avant que l'utilisateur interagisse avec les fenêtres.

## Style visuel

Terminal CRT phosphore vert : fond `#0a0a0a`, texte vert `#33ff33`, curseur jaune `#ffff33`. Police monospace. Lignes qui s'affichent une par une façon boot Unix.

## Comportement

- **Fréquence :** une fois par session (`sessionStorage`). Si `sessionStorage.getItem('boot-done')` est présent au montage, `onDone()` est appelé immédiatement sans animation.
- **Durée :** ~3s (7 lignes × 400ms de stagger). Skippable à tout moment via clic sur le composant ou n'importe quelle touche (listener `keydown` sur `document` dans un `useEffect`, retiré au démontage).
- **Fin de séquence :** 600ms après la dernière ligne, `onDone()` est déclenché automatiquement.
- **Transition sortie :** scan line CRT — le composant se contracte verticalement vers le centre (`scaleY(0)`) en 300ms via exit animation framer-motion. Le skip joue toujours cette transition.
- **Après démontage :** `sessionStorage.setItem('boot-done', '1')` est écrit.

## Contenu des lignes

```
Portfolio OS 2026 — Samuel Boulery
Booting imagination................ OK
Loading 6 years of experience...... OK
Injecting obsession with details... OK
Connecting EDF / CBTW instances.... OK
Warming up coffee.................. OK
Ready.............................. ▌
```

La dernière ligne affiche le curseur clignotant `▌` en jaune à la place de `OK`.

## Architecture

### Nouveau composant

```
src/components/os/BootScreen/
├── BootScreen.tsx
└── BootScreen.module.css
```

Interface :
```ts
interface BootScreenProps {
  onDone: () => void;
}
```

### Intégration dans Scene.tsx

```tsx
const [bootDone, setBootDone] = useState(false);

<AnimatePresence>
  {!bootDone && <BootScreen onDone={() => setBootDone(true)} />}
</AnimatePresence>

// Les useEffect qui ouvrent les fenêtres restent inchangés —
// ils s'exécutent dès le montage de Scene, mais les fenêtres
// sont sous le BootScreen (z-index) jusqu'à ce que celui-ci disparaisse.
```

`BootScreen` se positionne en `position: fixed; inset: 0; z-index: var(--z-overlay)` pour couvrir tout l'écran au-dessus des fenêtres existantes.

### Animation framer-motion

```tsx
<motion.div
  initial={{ opacity: 1 }}
  exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
  style={{ transformOrigin: 'center' }}
>
```

## Tokens CSS (components.css)

```css
--boot-bg: #0a0a0a;
--boot-text: #33ff33;
--boot-text-ok: #33ff33;
--boot-text-cursor: #ffff33;
--boot-duration-line: 400ms;
--boot-duration-exit: 300ms;

@keyframes bootLine {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes bootCursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@keyframes crtOff {
  0%   { transform: scaleY(1); opacity: 1; }
  60%  { transform: scaleY(0.008); opacity: 1; }
  100% { transform: scaleY(0); opacity: 0; }
}
```

## Accessibilité

- `prefers-reduced-motion` : si actif, toutes les animations sont désactivées et `onDone()` est appelé immédiatement (même comportement que sessionStorage déjà vu). Implémenté via le hook `useReducedMotion()` de framer-motion.
- `aria-hidden="true"` sur le composant (purement décoratif).

## Tests

### Unit (Vitest + Testing Library)
- `onDone` est appelé après la fin de la séquence (mock des timers)
- Click sur le composant appelle `onDone` immédiatement
- `onKeyDown` sur le composant appelle `onDone` immédiatement
- Si `sessionStorage` contient `boot-done`, `onDone` est appelé sans délai au montage

### E2E (Playwright)
- Session vierge : boot screen visible au chargement, desktop non interactif dessous
- Attente fin d'animation : fenêtres visibles après disparition du boot screen
- Reload (sessionStorage présent) : boot screen absent, desktop directement visible
- Skip : clic pendant le boot → scan line joue → desktop visible

## Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/components/os/Scene.tsx` | Ajouter `useState(bootDone)` + `AnimatePresence` + `<BootScreen>` |
| `styles/tokens/components.css` | Ajouter tokens `--boot-*` + keyframes |
| `src/components/os/BootScreen/BootScreen.tsx` | Nouveau |
| `src/components/os/BootScreen/BootScreen.module.css` | Nouveau |
| `tests/unit/BootScreen.test.tsx` | Nouveau |
| `tests/e2e/boot-screen.spec.ts` | Nouveau |
