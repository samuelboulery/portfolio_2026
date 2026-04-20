"use client";

import { type RefObject, useEffect, useState } from "react";
import { useWindowStore, type WindowPosition, type WindowSize } from "@/stores/windowStore";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface EdgeResizeOptions {
  readonly minWidth: number;
  readonly minHeight: number;
  readonly zone?: number;
  readonly enabled?: boolean;
}

function detectEdge(event: MouseEvent, rect: DOMRect, zone: number): ResizeEdge | null {
  const fromTop = event.clientY - rect.top;
  const fromBottom = rect.bottom - event.clientY;
  const fromLeft = event.clientX - rect.left;
  const fromRight = rect.right - event.clientX;

  const nearTop = fromTop >= 0 && fromTop <= zone;
  const nearBottom = fromBottom >= 0 && fromBottom <= zone;
  const nearLeft = fromLeft >= 0 && fromLeft <= zone;
  const nearRight = fromRight >= 0 && fromRight <= zone;

  if (nearTop && nearLeft) return "nw";
  if (nearTop && nearRight) return "ne";
  if (nearBottom && nearLeft) return "sw";
  if (nearBottom && nearRight) return "se";
  if (nearTop) return "n";
  if (nearBottom) return "s";
  if (nearLeft) return "w";
  if (nearRight) return "e";
  return null;
}

function cursorFor(edge: ResizeEdge | null): string {
  switch (edge) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    default:
      return "";
  }
}

export function useEdgeResize(
  ref: RefObject<HTMLElement | null>,
  id: string,
  opts: EdgeResizeOptions,
): boolean {
  const { minWidth, minHeight, zone = 6, enabled = true } = opts;
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let activeEdge: ResizeEdge | null = null;

    function onMouseMove(event: MouseEvent) {
      if (activeEdge || !el) return;
      const rect = el.getBoundingClientRect();
      const edge = detectEdge(event, rect, zone);
      el.style.cursor = cursorFor(edge);
    }

    function onMouseLeave() {
      if (activeEdge || !el) return;
      el.style.cursor = "";
    }

    function onMouseDown(event: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const edge = detectEdge(event, rect, zone);
      if (!edge) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      activeEdge = edge;
      setIsResizing(true);
      el.style.cursor = cursorFor(edge);

      const store = useWindowStore.getState();
      store.focusWindow(id);
      const startPosition: WindowPosition = store.windows[id]?.position ?? {
        x: 0,
        y: 0,
      };
      const startWidth = rect.width;
      const startHeight = rect.height;
      const startX = event.clientX;
      const startY = event.clientY;

      const goesEast = edge === "e" || edge === "ne" || edge === "se";
      const goesWest = edge === "w" || edge === "nw" || edge === "sw";
      const goesNorth = edge === "n" || edge === "ne" || edge === "nw";
      const goesSouth = edge === "s" || edge === "se" || edge === "sw";

      let rafId = 0;
      let pendingSize: WindowSize = { width: startWidth, height: startHeight };
      let pendingPosition: WindowPosition = startPosition;

      function flush() {
        rafId = 0;
        const s = useWindowStore.getState();
        s.updateSize(id, pendingSize);
        if (pendingPosition.x !== startPosition.x || pendingPosition.y !== startPosition.y) {
          s.updatePosition(id, pendingPosition);
        }
      }

      function onMove(ev: MouseEvent) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startPosition.x;
        let newY = startPosition.y;

        if (goesEast) newWidth = startWidth + dx;
        if (goesWest) {
          newWidth = startWidth - dx;
          newX = startPosition.x + dx;
        }
        if (goesSouth) newHeight = startHeight + dy;
        if (goesNorth) {
          newHeight = startHeight - dy;
          newY = startPosition.y + dy;
        }

        if (newWidth < minWidth) {
          if (goesWest) newX -= minWidth - newWidth;
          newWidth = minWidth;
        }
        if (newHeight < minHeight) {
          if (goesNorth) newY -= minHeight - newHeight;
          newHeight = minHeight;
        }

        pendingSize = { width: newWidth, height: newHeight };
        pendingPosition = { x: newX, y: newY };

        if (!rafId) rafId = requestAnimationFrame(flush);
      }

      function onUp() {
        activeEdge = null;
        setIsResizing(false);
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        if (el) el.style.cursor = "";
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mousedown", onMouseDown, { capture: true });

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mousedown", onMouseDown, { capture: true });
      el.style.cursor = "";
    };
  }, [ref, id, minWidth, minHeight, zone, enabled]);

  return isResizing;
}
