"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./LisaScrollbarArrow.module.css";

export type ArrowDirection = "up" | "down" | "left" | "right";

interface LisaScrollbarArrowProps {
  direction: ArrowDirection;
  ariaLabel: string;
  onStep: () => void;
  className?: string;
  style?: CSSProperties;
}

const REPEAT_INITIAL_DELAY_MS = 280;
const REPEAT_INTERVAL_MS = 60;

const ARROW_LABEL: Record<ArrowDirection, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

export function LisaScrollbarArrow({
  direction,
  ariaLabel,
  onStep,
  className,
  style,
}: LisaScrollbarArrowProps) {
  const [pressed, setPressed] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const onStepRef = useRef(onStep);

  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPressed(false);
  }, []);

  useEffect(() => stop, [stop]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setPressed(true);
    onStepRef.current();
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        onStepRef.current();
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_INITIAL_DELAY_MS);
  };

  const classes = [styles.arrow, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      data-direction={direction}
      data-pressed={pressed}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
      aria-label={ariaLabel}
      tabIndex={-1}
    >
      <ArrowGlyph direction={direction} />
      <span className={styles.srOnly}>{ARROW_LABEL[direction]}</span>
    </button>
  );
}

function ArrowGlyph({ direction }: { direction: ArrowDirection }) {
  const points = TRIANGLE_POINTS[direction];
  return (
    <svg
      className={styles.glyph}
      width="7"
      height="7"
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={points} fill="currentColor" />
    </svg>
  );
}

const TRIANGLE_POINTS: Record<ArrowDirection, string> = {
  up: "3.5,1 0.5,5 6.5,5",
  down: "0.5,2 6.5,2 3.5,6",
  left: "5,0.5 1,3.5 5,6.5",
  right: "2,0.5 6,3.5 2,6.5",
};
