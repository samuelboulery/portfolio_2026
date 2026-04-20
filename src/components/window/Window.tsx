"use client";

import { motion, type PanInfo, useDragControls } from "framer-motion";
import type { ReactNode } from "react";
import { useIsTabletOrBelow } from "@/hooks/useMediaQuery";
import { selectIsFocused, selectWindow, selectZIndex, useWindowStore } from "@/stores/windowStore";
import styles from "./Window.module.css";
import { WindowBar, type WindowBarVariant } from "./WindowBar";
import { WindowContent } from "./WindowContent";

interface WindowProps {
  id: string;
  title?: string;
  variant?: WindowBarVariant;
  children: ReactNode;
  className?: string;
  showContentPadding?: boolean;
  onExpand?: () => void;
}

export function Window({
  id,
  title,
  variant = "desktop",
  children,
  className,
  showContentPadding = true,
  onExpand,
}: WindowProps) {
  const windowState = useWindowStore(selectWindow(id));
  const zIndex = useWindowStore(selectZIndex(id));
  const isFocused = useWindowStore(selectIsFocused(id));
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const updatePosition = useWindowStore((state) => state.updatePosition);
  const dragControls = useDragControls();
  const isTabletOrBelow = useIsTabletOrBelow();

  if (!windowState?.isOpen || windowState.isMinimized) return null;

  const { position } = windowState;
  const effectiveVariant: WindowBarVariant = isTabletOrBelow ? "mobile" : variant;
  const isDraggable = effectiveVariant === "desktop";

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    updatePosition(id, {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
  };

  const classes = [styles.window, className].filter(Boolean).join(" ");
  const motionPosition = isDraggable ? { x: position.x, y: position.y } : { x: 0, y: 0 };

  return (
    <motion.div
      className={classes}
      data-focused={isFocused}
      data-variant={effectiveVariant}
      drag={isDraggable}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={motionPosition}
      animate={motionPosition}
      transition={{ duration: 0 }}
      style={{ zIndex }}
      onMouseDown={() => focusWindow(id)}
      onTouchStart={() => focusWindow(id)}
    >
      <WindowBar
        title={title ?? windowState.title}
        variant={effectiveVariant}
        dragControls={dragControls}
        onClose={() => closeWindow(id)}
        onMinimize={() => minimizeWindow(id)}
        onExpand={onExpand}
      />
      {showContentPadding ? (
        <WindowContent>{children}</WindowContent>
      ) : (
        <div className={styles.rawContent}>{children}</div>
      )}
    </motion.div>
  );
}
