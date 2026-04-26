"use client";

import type { CSSProperties, ReactNode } from "react";
import { FinderIcon, type FinderIconKind } from "@/components/ui/icons/FinderIcon";
import styles from "./FileIcon.module.css";

export type FileIconKind =
  | "folder"
  | "document"
  | "executable"
  | "application"
  | "hd"
  | "trash"
  | "clipboard";

interface FileIconProps {
  kind: FileIconKind;
  label: ReactNode;
  selected?: boolean;
  glyphSize?: number;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const KIND_TO_GLYPH: Record<FileIconKind, FinderIconKind> = {
  folder: "folder",
  document: "document",
  executable: "executable",
  application: "application",
  hd: "hd",
  trash: "trash",
  clipboard: "clipboard",
};

export function FileIcon({
  kind,
  label,
  selected = false,
  glyphSize,
  className,
  ariaLabel,
  onClick,
  onDoubleClick,
}: FileIconProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const glyphKind: FinderIconKind =
    selected && kind === "folder" ? "folder-selected" : KIND_TO_GLYPH[kind];
  const style: CSSProperties = glyphSize
    ? ({ "--file-icon-glyph-size-override": `${glyphSize}px` } as CSSProperties)
    : {};

  return (
    <button
      type="button"
      className={classes}
      data-selected={selected || undefined}
      data-kind={kind}
      aria-label={ariaLabel}
      aria-pressed={selected}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <span className={styles.glyph} aria-hidden="true">
        <FinderIcon kind={glyphKind} size={glyphSize ?? 40} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
