"use client";

import type { ComponentType, SVGProps } from "react";
import styles from "./Dock.module.css";
import { CvIcon } from "./icons/CvIcon";
import { FolderIcon } from "./icons/FolderIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { ImageIcon } from "./icons/ImageIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { TerminalIcon } from "./icons/TerminalIcon";

type DockAppId = "home" | "cv" | "image" | "folder" | "terminal" | "linkedin";

interface DockApp {
  id: DockAppId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  href?: string;
}

const APPS: readonly DockApp[] = [
  { id: "home", label: "Bureau", Icon: HomeIcon },
  { id: "cv", label: "Curriculum vitae", Icon: CvIcon },
  { id: "image", label: "ASCII art", Icon: ImageIcon },
  { id: "folder", label: "Projets", Icon: FolderIcon },
  { id: "terminal", label: "Terminal", Icon: TerminalIcon },
  { id: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
];

interface DockProps {
  activeIds?: readonly DockAppId[];
  onAppClick?: (id: DockAppId) => void;
}

export function Dock({ activeIds = [], onAppClick }: DockProps) {
  return (
    <div className={styles.dockWrapper}>
      <nav className={styles.dock} aria-label="Dock applications">
        {APPS.map(({ id, label, Icon }) => {
          const isActive = activeIds.includes(id);
          const indicatorClass = [styles.indicator, isActive ? styles.indicatorActive : null]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={id} className={styles.appSlot}>
              <button
                type="button"
                className={styles.appButton}
                aria-label={label}
                aria-pressed={isActive}
                onClick={() => onAppClick?.(id)}
              >
                <Icon size={22} aria-hidden="true" />
              </button>
              <span className={indicatorClass} aria-hidden="true" />
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export type { DockAppId };
