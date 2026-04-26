interface HappyMacProps {
  size?: number;
  className?: string;
}

/**
 * Happy Mac — icône iconique du Macintosh original (Susan Kare, 1984).
 * Pixel art 1-bit dessiné en rects SVG, scalable sans perte via image-rendering.
 */
export function HappyMac({ size = 64, className }: HappyMacProps) {
  return (
    <svg
      viewBox="0 0 32 36"
      width={size}
      height={(size * 36) / 32}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      <title>Macintosh</title>
      {/* Carrosserie : rectangle noir extérieur + remplissage blanc */}
      <rect x="2" y="0" width="28" height="26" fill="#000" />
      <rect x="3" y="1" width="26" height="24" fill="#fff" />

      {/* Écran : cadre noir + intérieur blanc */}
      <rect x="5" y="3" width="22" height="16" fill="#000" />
      <rect x="6" y="4" width="20" height="14" fill="#fff" />

      {/* Yeux */}
      <rect x="11" y="8" width="2" height="3" fill="#000" />
      <rect x="19" y="8" width="2" height="3" fill="#000" />

      {/* Sourire en U (3 segments de pixels) */}
      <rect x="11" y="14" width="1" height="1" fill="#000" />
      <rect x="12" y="15" width="8" height="1" fill="#000" />
      <rect x="20" y="14" width="1" height="1" fill="#000" />

      {/* Fente disquette */}
      <rect x="10" y="21" width="12" height="2" fill="#000" />

      {/* Base / pied du Mac */}
      <rect x="4" y="26" width="24" height="6" fill="#000" />
      <rect x="5" y="27" width="22" height="4" fill="#fff" />
      <rect x="8" y="29" width="16" height="1" fill="#000" />

      {/* Ombre / ligne sous la base */}
      <rect x="2" y="32" width="28" height="2" fill="#000" />
    </svg>
  );
}
