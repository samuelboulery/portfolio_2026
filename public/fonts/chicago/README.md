# Police Chicago — thème Mac Lisa

La police *Chicago* (Susan Kare, 1984) est l'identité typographique de l'OS Mac
classique. Elle n'est pas distribuée librement par Apple — il faut récupérer
une variante équivalente.

## Pour activer la police authentique

Déposer **un** des fichiers suivants dans ce dossier :

| Fichier | Source | Licence |
|---|---|---|
| `ChicagoFLF.ttf` | https://www.fontsgeek.com/fonts/chicagoflf-regular *(CoolFonts)* | Libre usage perso/web |
| `ChiKareGo2.ttf` | https://www.dafont.com/chikarego2.font *(Heller-Levinson)* | Libre |
| `Chicago.ttf` | Mirror communautaire | À vérifier au cas par cas |

L'ordre du fallback dans `styles/fonts.css` essaie ces trois noms successivement.

## Sans fichier déposé

L'app utilise **Silkscreen** (déjà chargée dans `public/fonts/silkscreen/`,
licence OFL). Le rendu reste pixel 1-bit cohérent avec le thème Lisa, juste
légèrement plus 8-bit/blocky que la Chicago authentique.
