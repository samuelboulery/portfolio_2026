import { type RefObject, useEffect, useState } from "react";

export interface AxisMetrics {
  readonly scrollSize: number;
  readonly viewportSize: number;
  readonly scrollPos: number;
  readonly hasOverflow: boolean;
}

export interface ScrollbarMetrics {
  readonly vertical: AxisMetrics;
  readonly horizontal: AxisMetrics;
}

const ZERO_AXIS: AxisMetrics = {
  scrollSize: 0,
  viewportSize: 0,
  scrollPos: 0,
  hasOverflow: false,
};

const INITIAL_METRICS: ScrollbarMetrics = {
  vertical: ZERO_AXIS,
  horizontal: ZERO_AXIS,
};

function readMetrics(viewport: HTMLElement): ScrollbarMetrics {
  return {
    vertical: {
      scrollSize: viewport.scrollHeight,
      viewportSize: viewport.clientHeight,
      scrollPos: viewport.scrollTop,
      hasOverflow: viewport.scrollHeight > viewport.clientHeight + 1,
    },
    horizontal: {
      scrollSize: viewport.scrollWidth,
      viewportSize: viewport.clientWidth,
      scrollPos: viewport.scrollLeft,
      hasOverflow: viewport.scrollWidth > viewport.clientWidth + 1,
    },
  };
}

function metricsEqual(a: ScrollbarMetrics, b: ScrollbarMetrics): boolean {
  return (
    a.vertical.scrollSize === b.vertical.scrollSize &&
    a.vertical.viewportSize === b.vertical.viewportSize &&
    a.vertical.scrollPos === b.vertical.scrollPos &&
    a.horizontal.scrollSize === b.horizontal.scrollSize &&
    a.horizontal.viewportSize === b.horizontal.viewportSize &&
    a.horizontal.scrollPos === b.horizontal.scrollPos
  );
}

export function useScrollbarMetrics(viewportRef: RefObject<HTMLElement | null>): ScrollbarMetrics {
  const [metrics, setMetrics] = useState<ScrollbarMetrics>(INITIAL_METRICS);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setMetrics((prev) => {
          const next = readMetrics(viewport);
          return metricsEqual(prev, next) ? prev : next;
        });
      });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    for (const child of Array.from(viewport.children)) {
      ro.observe(child);
    }

    const mo = new MutationObserver(measure);
    mo.observe(viewport, { childList: true, subtree: true, characterData: true });

    viewport.addEventListener("scroll", measure, { passive: true });
    measure();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      viewport.removeEventListener("scroll", measure);
    };
  }, [viewportRef]);

  return metrics;
}

export interface ThumbGeometry {
  readonly size: number;
  readonly offset: number;
  readonly trackSize: number;
}

export function computeThumbGeometry(
  axis: AxisMetrics,
  trackSize: number,
  thumbMin: number,
): ThumbGeometry {
  if (!axis.hasOverflow || trackSize <= 0 || axis.scrollSize <= 0) {
    return { size: 0, offset: 0, trackSize };
  }
  const ratio = axis.viewportSize / axis.scrollSize;
  const rawSize = trackSize * ratio;
  const size = Math.max(rawSize, Math.min(thumbMin, trackSize));
  const maxScroll = Math.max(axis.scrollSize - axis.viewportSize, 1);
  const maxOffset = Math.max(trackSize - size, 0);
  const offset = (axis.scrollPos / maxScroll) * maxOffset;
  return { size, offset, trackSize };
}
