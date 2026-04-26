"use client";

import type { DragControls } from "framer-motion";
import { type PointerEvent, useState } from "react";
import { FinderIcon } from "@/components/ui/icons/FinderIcon";
import styles from "./WindowBar.module.css";

export type WindowBarVariant = "desktop" | "mobile";

interface WindowBarProps {
  title?: string;
  variant?: WindowBarVariant;
  isFocused: boolean;
  dragControls?: DragControls;
  onClose: () => void;
  onZoom?: () => void;
}

type PressedWidget = "close" | "zoom" | null;

export function WindowBar({
  title,
  variant = "desktop",
  isFocused,
  dragControls,
  onClose,
  onZoom,
}: WindowBarProps) {
  const isDraggable = variant === "desktop" && Boolean(dragControls);
  const [pressed, setPressed] = useState<PressedWidget>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggable || !dragControls) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    dragControls.start(event);
  };

  const widgetHandlers = (widget: "close" | "zoom") => ({
    onPointerDown: () => setPressed(widget),
    onPointerUp: () => setPressed(null),
    onPointerLeave: () => setPressed(null),
    onPointerCancel: () => setPressed(null),
  });

  return (
    <div
      className={styles.bar}
      data-draggable={isDraggable}
      data-variant={variant}
      data-focused={isFocused}
      onPointerDown={handlePointerDown}
    >
      <span className={styles.closeSlot}>
        <button
          type="button"
          className={styles.widget}
          aria-label="Fermer la fenêtre"
          onClick={onClose}
          {...widgetHandlers("close")}
        >
          <FinderIcon kind="close-box" size={11} pressed={pressed === "close"} />
        </button>
      </span>
      {title ? <span className={styles.title}>{title}</span> : null}
      <span className={styles.zoomSlot}>
        <button
          type="button"
          className={styles.widget}
          aria-label="Agrandir la fenêtre"
          onClick={onZoom}
          disabled={!onZoom}
          {...widgetHandlers("zoom")}
        >
          <FinderIcon kind="zoom-box" size={11} pressed={pressed === "zoom"} />
        </button>
      </span>
    </div>
  );
}
