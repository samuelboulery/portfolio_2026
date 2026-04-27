import styles from "./LisaScrollbarCorner.module.css";

export function LisaScrollbarCorner() {
  return (
    <div className={styles.corner} aria-hidden="true">
      <svg
        className={styles.glyph}
        width="11"
        height="11"
        viewBox="0 0 11 11"
        shapeRendering="crispEdges"
        focusable="false"
        role="presentation"
      >
        <title>Resize</title>
        <polygon points="10,1 10,10 1,10" fill="currentColor" />
        <line
          x1="2"
          y1="10"
          x2="10"
          y2="2"
          stroke="var(--lisa-scrollbar-corner-bg)"
          strokeWidth="1"
        />
        <line
          x1="5"
          y1="10"
          x2="10"
          y2="5"
          stroke="var(--lisa-scrollbar-corner-bg)"
          strokeWidth="1"
        />
        <line
          x1="8"
          y1="10"
          x2="10"
          y2="8"
          stroke="var(--lisa-scrollbar-corner-bg)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
