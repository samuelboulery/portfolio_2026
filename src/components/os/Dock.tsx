"use client";

import { FileText, Folder, Home, Image as ImageIcon, Terminal } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import styles from "./Dock.module.css";
import { LinkedinIcon } from "./icons/LinkedinIcon";

type DockAppId = "home" | "cv" | "image" | "folder" | "terminal" | "linkedin";

interface DockApp {
  id: DockAppId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  href?: string;
}

const APPS: readonly DockApp[] = [
  { id: "home", label: "Bureau", Icon: Home },
  { id: "cv", label: "Curriculum vitae", Icon: FileText },
  { id: "image", label: "ASCII art", Icon: ImageIcon },
  { id: "folder", label: "Projets", Icon: Folder },
  { id: "terminal", label: "Terminal", Icon: Terminal },
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
