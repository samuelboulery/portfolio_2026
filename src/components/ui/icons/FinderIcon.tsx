"use client";

import type { CSSProperties, ReactElement } from "react";

export type FinderIconKind =
  | "folder"
  | "folder-selected"
  | "document"
  | "executable"
  | "application"
  | "hd"
  | "trash"
  | "warning"
  | "apple"
  | "close-box"
  | "zoom-box"
  | "grow-box";

interface FinderIconProps {
  kind: FinderIconKind;
  size?: number;
  pressed?: boolean;
  className?: string;
  title?: string;
}

interface IconShape {
  viewBox: string;
  render: (pressed: boolean) => ReactElement;
}

const SHAPES: Record<FinderIconKind, IconShape> = {
  folder: {
    viewBox: "0 0 32 24",
    render: () => (
      <>
        <path
          d="M 1.5 6.5 L 1.5 22.5 L 30.5 22.5 L 30.5 6.5 L 17.5 6.5 L 17.5 3.5 L 6.5 3.5 L 6.5 6.5 Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="1"
        />
      </>
    ),
  },
  "folder-selected": {
    viewBox: "0 0 32 24",
    render: () => (
      <>
        <path
          d="M 1.5 6.5 L 1.5 22.5 L 30.5 22.5 L 30.5 6.5 L 17.5 6.5 L 17.5 3.5 L 6.5 3.5 L 6.5 6.5 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
      </>
    ),
  },
  document: {
    viewBox: "0 0 24 32",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <path d="M 2.5 1.5 L 16.5 1.5 L 21.5 6.5 L 21.5 30.5 L 2.5 30.5 Z" />
        <path d="M 16.5 1.5 L 16.5 6.5 L 21.5 6.5" fill="white" />
        {[12, 16, 20, 24].map((y) => (
          <line key={y} x1="6" y1={y} x2="18" y2={y} stroke="currentColor" />
        ))}
      </g>
    ),
  },
  executable: {
    viewBox: "0 0 24 32",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <path d="M 2.5 1.5 L 16.5 1.5 L 21.5 6.5 L 21.5 30.5 L 2.5 30.5 Z" />
        <path d="M 16.5 1.5 L 16.5 6.5 L 21.5 6.5" fill="white" />
        <text
          x="12"
          y="20"
          fontFamily="ChicagoFLF, monospace"
          fontSize="9"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
        >
          *@
        </text>
        <text
          x="12"
          y="28"
          fontFamily="ChicagoFLF, monospace"
          fontSize="9"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
        >
          #!
        </text>
      </g>
    ),
  },
  application: {
    viewBox: "0 0 24 32",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <path d="M 2.5 1.5 L 16.5 1.5 L 21.5 6.5 L 21.5 30.5 L 2.5 30.5 Z" />
        <path d="M 16.5 1.5 L 16.5 6.5 L 21.5 6.5" fill="white" />
        {/* Mini title bar inside the page */}
        <rect x="5" y="9" width="14" height="3" fill="currentColor" stroke="none" />
        <rect x="6" y="10" width="2" height="1" fill="white" stroke="none" />
        {/* ⌘ glyph approximation : two interlocking loops drawn as 4 small squares */}
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="7.5" y="14.5" width="3" height="3" />
          <rect x="13.5" y="14.5" width="3" height="3" />
          <rect x="7.5" y="20.5" width="3" height="3" />
          <rect x="13.5" y="20.5" width="3" height="3" />
          <line x1="10.5" y1="16" x2="13.5" y2="16" />
          <line x1="10.5" y1="22" x2="13.5" y2="22" />
          <line x1="9" y1="17.5" x2="9" y2="20.5" />
          <line x1="15" y1="17.5" x2="15" y2="20.5" />
        </g>
      </g>
    ),
  },
  hd: {
    viewBox: "0 0 32 24",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        {/* Mac case body */}
        <rect x="2.5" y="1.5" width="27" height="21" />
        {/* Screen */}
        <rect x="5.5" y="4.5" width="14" height="10" />
        {/* Floppy slot */}
        <rect x="22.5" y="6.5" width="5" height="1" fill="currentColor" stroke="none" />
        {/* Speaker grille */}
        <line x1="6" y1="17" x2="14" y2="17" />
        <line x1="6" y1="19" x2="14" y2="19" />
        {/* Power led */}
        <rect x="22.5" y="17.5" width="2" height="2" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  trash: {
    viewBox: "0 0 24 28",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        {/* Lid */}
        <rect x="2.5" y="3.5" width="19" height="3" />
        {/* Handle */}
        <rect x="9.5" y="1.5" width="5" height="2" />
        {/* Body */}
        <path d="M 4.5 7.5 L 5.5 26.5 L 18.5 26.5 L 19.5 7.5" />
        {/* Vertical lines */}
        <line x1="9" y1="10" x2="9" y2="24" />
        <line x1="12" y1="10" x2="12" y2="24" />
        <line x1="15" y1="10" x2="15" y2="24" />
      </g>
    ),
  },
  warning: {
    viewBox: "0 0 32 32",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {/* Equilateral triangle */}
        <path d="M 16 3 L 30 28 L 2 28 Z" strokeLinejoin="miter" />
        {/* Exclamation */}
        <line x1="16" y1="11" x2="16" y2="21" strokeWidth="2.5" />
        <circle cx="16" cy="25" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      </g>
    ),
  },
  apple: {
    viewBox: "0 0 16 16",
    render: () => (
      <g fill="currentColor" stroke="none">
        {/* Body of the apple */}
        <path d="M 4 5 Q 1.5 5 1.5 9 Q 1.5 14 5 14 Q 6.5 14 8 13.4 Q 9.5 14 11 14 Q 14.5 14 14.5 9 Q 14.5 5 12 5 Q 10 5 9 6 Q 8.5 6.3 8 6.3 Q 7.5 6.3 7 6 Q 6 5 4 5 Z" />
        {/* Bite */}
        <path d="M 14.5 7 Q 13 6.5 13 8 Q 13 9.5 14.5 9 Z" fill="white" />
        {/* Leaf */}
        <path d="M 8 4 Q 9 1.5 11 1.5 Q 10 4 8 5 Z" />
      </g>
    ),
  },
  "close-box": {
    viewBox: "0 0 11 11",
    render: (pressed) => (
      <rect
        x="0.5"
        y="0.5"
        width="10"
        height="10"
        fill={pressed ? "currentColor" : "white"}
        stroke="currentColor"
        strokeWidth="1"
      />
    ),
  },
  "zoom-box": {
    viewBox: "0 0 11 11",
    render: (pressed) => (
      <g fill={pressed ? "currentColor" : "white"} stroke="currentColor" strokeWidth="1">
        <rect x="0.5" y="0.5" width="10" height="10" />
        <rect x="2.5" y="2.5" width="6" height="6" fill={pressed ? "white" : "currentColor"} />
      </g>
    ),
  },
  "grow-box": {
    viewBox: "0 0 15 15",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <rect x="0.5" y="0.5" width="14" height="14" />
        {/* Inner small square (filled) — the visual « grip » */}
        <rect x="3.5" y="3.5" width="8" height="8" fill="currentColor" />
        <rect x="5.5" y="5.5" width="4" height="4" fill="white" stroke="none" />
      </g>
    ),
  },
};

export function FinderIcon({
  kind,
  size = 32,
  pressed = false,
  className,
  title,
}: FinderIconProps) {
  const shape = SHAPES[kind];
  const style: CSSProperties = { width: size, height: size, display: "inline-block" };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={shape.viewBox}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      data-icon-kind={kind}
      data-pressed={pressed || undefined}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {shape.render(pressed)}
    </svg>
  );
}
