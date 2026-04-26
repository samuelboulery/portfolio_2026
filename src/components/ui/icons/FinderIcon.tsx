"use client";

import type { CSSProperties, ReactElement } from "react";

export type FinderIconKind =
  | "folder"
  | "folder-selected"
  | "document"
  | "executable"
  | "application"
  | "clipboard"
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

interface AssetEntry {
  src: string;
  ratio: number;
}

const ASSET_KINDS = {
  folder: { src: "/icons/finder/folder.svg", ratio: 94.25 / 76.125 },
  "folder-selected": { src: "/icons/finder/folder-selected.svg", ratio: 94.25 / 76.125 },
  document: { src: "/icons/finder/document.svg", ratio: 79.75 / 101.5 },
  executable: { src: "/icons/finder/executable.svg", ratio: 79.75 / 101.5 },
  application: { src: "/icons/finder/application.svg", ratio: 105.125 / 105.125 },
  clipboard: { src: "/icons/finder/clipboard.svg", ratio: 65.25 / 94.25 },
} as const satisfies Partial<Record<FinderIconKind, AssetEntry>>;

type AssetKind = keyof typeof ASSET_KINDS;
type InlineKind = Exclude<FinderIconKind, AssetKind>;

interface IconShape {
  viewBox: string;
  render: (pressed: boolean) => ReactElement;
}

const SHAPES: Record<InlineKind, IconShape> = {
  hd: {
    viewBox: "0 0 32 24",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <rect x="2.5" y="1.5" width="27" height="21" />
        <rect x="5.5" y="4.5" width="14" height="10" />
        <rect x="22.5" y="6.5" width="5" height="1" fill="currentColor" stroke="none" />
        <line x1="6" y1="17" x2="14" y2="17" />
        <line x1="6" y1="19" x2="14" y2="19" />
        <rect x="22.5" y="17.5" width="2" height="2" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  trash: {
    viewBox: "0 0 24 28",
    render: () => (
      <g fill="white" stroke="currentColor" strokeWidth="1">
        <rect x="2.5" y="3.5" width="19" height="3" />
        <rect x="9.5" y="1.5" width="5" height="2" />
        <path d="M 4.5 7.5 L 5.5 26.5 L 18.5 26.5 L 19.5 7.5" />
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
        <path d="M 16 3 L 30 28 L 2 28 Z" strokeLinejoin="miter" />
        <line x1="16" y1="11" x2="16" y2="21" strokeWidth="2.5" />
        <circle cx="16" cy="25" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      </g>
    ),
  },
  apple: {
    viewBox: "0 0 16 16",
    render: () => (
      <g fill="currentColor" stroke="none">
        <path d="M 4 5 Q 1.5 5 1.5 9 Q 1.5 14 5 14 Q 6.5 14 8 13.4 Q 9.5 14 11 14 Q 14.5 14 14.5 9 Q 14.5 5 12 5 Q 10 5 9 6 Q 8.5 6.3 8 6.3 Q 7.5 6.3 7 6 Q 6 5 4 5 Z" />
        <path d="M 14.5 7 Q 13 6.5 13 8 Q 13 9.5 14.5 9 Z" fill="white" />
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
        <rect x="3.5" y="3.5" width="8" height="8" fill="currentColor" />
        <rect x="5.5" y="5.5" width="4" height="4" fill="white" stroke="none" />
      </g>
    ),
  },
};

function isAssetKind(kind: FinderIconKind): kind is AssetKind {
  return kind in ASSET_KINDS;
}

export function FinderIcon({
  kind,
  size = 32,
  pressed = false,
  className,
  title,
}: FinderIconProps) {
  if (isAssetKind(kind)) {
    const asset = ASSET_KINDS[kind];
    const width = asset.ratio >= 1 ? size : size * asset.ratio;
    const height = asset.ratio >= 1 ? size / asset.ratio : size;
    return (
      // biome-ignore lint/performance/noImgElement: pixel-art statique, next/image inutile
      <img
        src={asset.src}
        alt={title ?? ""}
        width={width}
        height={height}
        className={className}
        style={{ display: "inline-block", imageRendering: "pixelated" }}
        data-icon-kind={kind}
        aria-hidden={title ? undefined : true}
        draggable={false}
      />
    );
  }

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
