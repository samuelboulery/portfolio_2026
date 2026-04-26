interface FolderTabProps {
  className?: string;
}

/**
 * Onglet de chemise (tab Mac Lisa).
 *
 * Forme : rectangle blanc 50×13 avec un coin top-right chamfreiné de 4×4 px,
 * matérialisant le « pli » caractéristique des dossiers du Lisa Office System.
 * 1px noir sur 3 côtés (top + gauche + droite + chamfer), pas de bordure
 * inférieure (s'imbrique avec le corps de la chemise).
 */
export function FolderTab({ className }: FolderTabProps) {
  return (
    <svg
      className={className}
      width="50"
      height="13"
      viewBox="0 0 50 13"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Remplissage : rectangle avec coin top-right chamfreiné (pli). */}
      <path d="M0 0 H46 L50 4 V13 H0 Z" fill="var(--project-folder-bg-1)" />
      {/* Tracé : top, droite (sous le pli), gauche. Pas de bordure inférieure. */}
      <path
        d="M0.5 13 V0.5 H46 L49.5 4 V13"
        stroke="var(--project-folder-border-color)"
        strokeWidth="1"
        fill="none"
      />
      {/* Ligne du pli (du sommet du chamfer vers son extrémité droite). */}
      <path
        d="M46 0 L46 4 L50 4"
        stroke="var(--project-folder-border-color)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
