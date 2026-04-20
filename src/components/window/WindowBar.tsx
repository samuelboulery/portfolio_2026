"use client";

import type { DragControls } from "framer-motion";
import type { PointerEvent } from "react";
import styles from "./WindowBar.module.css";

export type WindowBarVariant = "desktop" | "mobile";

interface WindowBarProps {
  title?: string;
  variant?: WindowBarVariant;
  dragControls?: DragControls;
  onClose: () => void;
  onMinimize: () => void;
  onExpand?: () => void;
}

export function WindowBar({
  title,
  variant = "desktop",
  dragControls,
  onClose,
  onMinimize,
  onExpand,
}: WindowBarProps) {
  const isDraggable = variant === "desktop" && Boolean(dragControls);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggable || !dragControls) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    dragControls.start(event);
  };

  return (
    <div
      className={styles.bar}
      data-draggable={isDraggable}
      data-variant={variant}
      onPointerDown={handlePointerDown}
    >
      <div className={styles.dots}>
        <button
          type="button"
          className={`${styles.dot} ${styles.close}`}
          aria-label="Fermer la fenêtre"
          onClick={onClose}
        />
        <button
          type="button"
          className={`${styles.dot} ${styles.reduce}`}
          aria-label="Réduire la fenêtre"
          onClick={onMinimize}
        />
        <button
          type="button"
          className={`${styles.dot} ${styles.expand}`}
          aria-label="Agrandir la fenêtre"
          onClick={onExpand}
          disabled={!onExpand}
        />
      </div>
      {title ? <span className={styles.title}>{title}</span> : null}
      <div className={styles.spacer} aria-hidden="true" />
    </div>
  );
}
