"use client";

import { type ReactNode, useCallback, useRef } from "react";
import styles from "./LisaScrollbar.module.css";
import { LisaScrollbarArrow } from "./LisaScrollbarArrow";
import { LisaScrollbarCorner } from "./LisaScrollbarCorner";
import { LisaScrollbarTrack } from "./LisaScrollbarTrack";
import { useScrollbarMetrics } from "./useScrollbarMetrics";

export type LisaScrollbarOrientation = "vertical" | "horizontal" | "both";

interface LisaScrollbarProps {
  children: ReactNode;
  orientation?: LisaScrollbarOrientation;
  showResizeCorner?: boolean;
  className?: string;
  viewportClassName?: string;
}

const STEP_PX = 24;
const THUMB_MIN_PX = 16;

export function LisaScrollbar({
  children,
  orientation = "both",
  showResizeCorner = false,
  className,
  viewportClassName,
}: LisaScrollbarProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const metrics = useScrollbarMetrics(viewportRef);

  const showVertical = orientation === "vertical" || orientation === "both";
  const showHorizontal = orientation === "horizontal" || orientation === "both";
  const showCorner = showResizeCorner && showVertical && showHorizontal;

  const stepBy = useCallback((axis: "vertical" | "horizontal", direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (axis === "vertical") {
      viewport.scrollBy({ top: direction * STEP_PX });
    } else {
      viewport.scrollBy({ left: direction * STEP_PX });
    }
  }, []);

  const wrapperClasses = [
    styles.wrapper,
    showVertical ? styles.hasVertical : null,
    showHorizontal ? styles.hasHorizontal : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const viewportClasses = [styles.viewport, viewportClassName].filter(Boolean).join(" ");

  return (
    <div className={wrapperClasses} data-orientation={orientation} data-has-corner={showCorner}>
      <div ref={viewportRef} className={viewportClasses}>
        {children}
      </div>

      {showVertical ? (
        <div className={styles.scrollbarVertical} aria-hidden={!metrics.vertical.hasOverflow}>
          <LisaScrollbarArrow
            direction="up"
            ariaLabel="Défiler vers le haut"
            onStep={() => stepBy("vertical", -1)}
          />
          <LisaScrollbarTrack
            orientation="vertical"
            axis={metrics.vertical}
            viewportRef={viewportRef}
            thumbMin={THUMB_MIN_PX}
            ariaLabel="Barre de défilement verticale"
          />
          <LisaScrollbarArrow
            direction="down"
            ariaLabel="Défiler vers le bas"
            onStep={() => stepBy("vertical", 1)}
          />
        </div>
      ) : null}

      {showHorizontal ? (
        <div className={styles.scrollbarHorizontal} aria-hidden={!metrics.horizontal.hasOverflow}>
          <LisaScrollbarArrow
            direction="left"
            ariaLabel="Défiler vers la gauche"
            onStep={() => stepBy("horizontal", -1)}
          />
          <LisaScrollbarTrack
            orientation="horizontal"
            axis={metrics.horizontal}
            viewportRef={viewportRef}
            thumbMin={THUMB_MIN_PX}
            ariaLabel="Barre de défilement horizontale"
          />
          <LisaScrollbarArrow
            direction="right"
            ariaLabel="Défiler vers la droite"
            onStep={() => stepBy("horizontal", 1)}
          />
        </div>
      ) : null}

      {showCorner ? (
        <div className={styles.cornerSlot}>
          <LisaScrollbarCorner />
        </div>
      ) : null}
    </div>
  );
}
