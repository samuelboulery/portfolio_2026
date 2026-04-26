"use client";

import styles from "./WindowStatusBar.module.css";

interface WindowStatusBarProps {
  segments: ReadonlyArray<string>;
  className?: string;
}

export function WindowStatusBar({ segments, className }: WindowStatusBarProps) {
  if (segments.length === 0) return null;

  const classes = [styles.bar, className].filter(Boolean).join(" ");
  const ariaLabel = `Fenêtre : ${segments.join(", ")}`;

  return (
    <aside className={classes} aria-label={ariaLabel}>
      {segments.map((segment) => (
        <span key={segment} className={styles.segment}>
          {segment}
        </span>
      ))}
    </aside>
  );
}
