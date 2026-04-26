"use client";

import { motion, type PanInfo, useDragControls } from "framer-motion";
import { type CSSProperties, type ReactNode, useRef } from "react";
import { useEdgeResize } from "@/hooks/useEdgeResize";
import { useIsTabletOrBelow } from "@/hooks/useMediaQuery";
import {
  selectIsFocused,
  selectWindow,
  selectZIndex,
  useWindowStore,
  type WindowState,
} from "@/stores/windowStore";
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
  onZoom?: () => void;
}

const RESIZE_MIN_WIDTH = 320;
const RESIZE_MIN_HEIGHT = 200;

export function Window(props: WindowProps) {
  const windowState = useWindowStore(selectWindow(props.id));
  if (!windowState?.isOpen || windowState.isMinimized) return null;
  return <MountedWindow {...props} windowState={windowState} />;
}

interface MountedWindowProps extends WindowProps {
  windowState: WindowState;
}

function MountedWindow({
  id,
  title,
  variant = "desktop",
  children,
  className,
  showContentPadding = true,
  onZoom,
  windowState,
}: MountedWindowProps) {
  const zIndex = useWindowStore(selectZIndex(id));
  const isFocused = useWindowStore(selectIsFocused(id));
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const updatePosition = useWindowStore((state) => state.updatePosition);
  const dragControls = useDragControls();
  const isTabletOrBelow = useIsTabletOrBelow();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const effectiveVariant: WindowBarVariant = isTabletOrBelow ? "mobile" : variant;
  const isDraggable = effectiveVariant === "desktop";

  const isResizing = useEdgeResize(containerRef, id, {
    minWidth: RESIZE_MIN_WIDTH,
    minHeight: RESIZE_MIN_HEIGHT,
    enabled: isDraggable,
  });

  const { position, size } = windowState;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    updatePosition(id, {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
  };

  const classes = [styles.window, className].filter(Boolean).join(" ");
  const motionPosition = isDraggable ? { x: position.x, y: position.y } : { x: 0, y: 0 };

  const style: CSSProperties = { zIndex };
  if (size && isDraggable) {
    style.width = size.width;
    style.height = size.height;
  }

  return (
    <motion.div
      ref={containerRef}
      className={classes}
      data-focused={isFocused}
      data-variant={effectiveVariant}
      data-resizing={isResizing}
      drag={isDraggable && !isResizing}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={motionPosition}
      animate={motionPosition}
      transition={{ duration: 0 }}
      style={style}
      onMouseDown={() => focusWindow(id)}
      onTouchStart={() => focusWindow(id)}
    >
      <WindowBar
        title={title ?? windowState.title}
        variant={effectiveVariant}
        isFocused={isFocused}
        dragControls={dragControls}
        onClose={() => closeWindow(id)}
        onZoom={onZoom}
      />
      {showContentPadding ? (
        <WindowContent>{children}</WindowContent>
      ) : (
        <div className={styles.rawContent}>{children}</div>
      )}
    </motion.div>
  );
}
