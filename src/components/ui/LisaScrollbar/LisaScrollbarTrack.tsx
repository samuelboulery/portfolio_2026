"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./LisaScrollbarTrack.module.css";
import { type AxisMetrics, computeThumbGeometry } from "./useScrollbarMetrics";

type Orientation = "vertical" | "horizontal";

interface LisaScrollbarTrackProps {
  orientation: Orientation;
  axis: AxisMetrics;
  viewportRef: RefObject<HTMLElement | null>;
  thumbMin: number;
  ariaLabel: string;
}

export function LisaScrollbarTrack({
  orientation,
  axis,
  viewportRef,
  thumbMin,
  ariaLabel,
}: LisaScrollbarTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackSize, setTrackSize] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => {
      const rect = track.getBoundingClientRect();
      setTrackSize(orientation === "vertical" ? rect.height : rect.width);
    });
    ro.observe(track);
    const rect = track.getBoundingClientRect();
    setTrackSize(orientation === "vertical" ? rect.height : rect.width);
    return () => ro.disconnect();
  }, [orientation]);

  const geometry = computeThumbGeometry(axis, trackSize, thumbMin);

  const dragStateRef = useRef<{
    pointerId: number;
    startCoord: number;
    startScroll: number;
    ratio: number;
  } | null>(null);

  const handleThumbPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const viewport = viewportRef.current;
      if (!viewport) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      const usableTrack = Math.max(geometry.trackSize - geometry.size, 1);
      const maxScroll = Math.max(axis.scrollSize - axis.viewportSize, 1);
      dragStateRef.current = {
        pointerId: event.pointerId,
        startCoord: orientation === "vertical" ? event.clientY : event.clientX,
        startScroll: axis.scrollPos,
        ratio: maxScroll / usableTrack,
      };
    },
    [
      axis.scrollPos,
      axis.scrollSize,
      axis.viewportSize,
      geometry.size,
      geometry.trackSize,
      orientation,
      viewportRef,
    ],
  );

  const handleThumbPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const viewport = viewportRef.current;
      if (!viewport) return;
      const coord = orientation === "vertical" ? event.clientY : event.clientX;
      const delta = coord - drag.startCoord;
      const next = drag.startScroll + delta * drag.ratio;
      if (orientation === "vertical") {
        viewport.scrollTop = next;
      } else {
        viewport.scrollLeft = next;
      }
    },
    [orientation, viewportRef],
  );

  const handleThumbPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
  }, []);

  const handleTrackPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      const rect = track.getBoundingClientRect();
      const clickCoord =
        orientation === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
      const direction = clickCoord < geometry.offset ? -1 : 1;
      const page = orientation === "vertical" ? viewport.clientHeight : viewport.clientWidth;
      if (orientation === "vertical") {
        viewport.scrollBy({ top: direction * page });
      } else {
        viewport.scrollBy({ left: direction * page });
      }
    },
    [geometry.offset, orientation, viewportRef],
  );

  const thumbStyle: CSSProperties =
    orientation === "vertical"
      ? { height: `${geometry.size}px`, transform: `translateY(${geometry.offset}px)` }
      : { width: `${geometry.size}px`, transform: `translateX(${geometry.offset}px)` };

  return (
    <div
      ref={trackRef}
      className={styles.track}
      data-orientation={orientation}
      data-testid={`lisa-scrollbar-${orientation}`}
      data-label={ariaLabel}
      aria-hidden="true"
      onPointerDown={handleTrackPointerDown}
    >
      {axis.hasOverflow && geometry.size > 0 ? (
        <div
          className={styles.thumb}
          data-orientation={orientation}
          style={thumbStyle}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
        />
      ) : null}
    </div>
  );
}
