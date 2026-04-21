"use client";

import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { Theme } from "@/hooks/useTheme";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./TopMenuBar.module.css";

interface TopMenuBarProps {
  setTheme: (t: Theme) => void;
  currentTheme: Theme;
}

type MenuId = "fichier" | "edition" | "vue" | "aide";

const FICHIER_ITEMS = [
  {
    label: "Accueil",
    id: "main",
    type: "main" as const,
    title: "System Designer",
    initialPosition: { x: 83, y: 320 },
  },
  {
    label: "Terminal",
    id: "terminal",
    type: "terminal" as const,
    title: "terminal",
    initialPosition: { x: 930, y: 458 },
  },
  {
    label: "CV",
    id: "cv",
    type: "cv" as const,
    title: "curriculum_vitae.html",
    initialPosition: { x: 200, y: 150 },
  },
] as const;

const THEME_ITEMS: { label: string; value: Theme }[] = [
  { label: "Thème Sombre", value: "dark" },
  { label: "Thème Clair", value: "light" },
  { label: "Thème Rétro", value: "retro" },
];

export function TopMenuBar({ setTheme, currentTheme }: TopMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleClickOutside = useCallback(() => setActiveMenu(null), []);
  useClickOutside(ref, handleClickOutside);

  function toggleMenu(id: MenuId) {
    setActiveMenu((prev) => (prev === id ? null : id));
  }

  return (
    <div className={styles.root} ref={ref}>
      {/* Fichier */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "fichier"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("fichier")}
        >
          Fichier
        </button>
        {activeMenu === "fichier" && (
          <div className={styles.dropdown} role="menu">
            {FICHIER_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={styles.item}
                onClick={() => {
                  setActiveMenu(null);
                  openWindow(item);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Édition */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "edition"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("edition")}
        >
          Édition
        </button>
        {activeMenu === "edition" && (
          <div className={styles.dropdown} role="menu">
            <p className={styles.emptyHint}>Bientôt disponible</p>
          </div>
        )}
      </div>

      {/* Vue */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "vue"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("vue")}
        >
          Vue
        </button>
        {activeMenu === "vue" && (
          <div className={styles.dropdown} role="menu">
            {THEME_ITEMS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                role="menuitem"
                className={`${styles.item} ${currentTheme === value ? styles.itemActive : ""}`}
                onClick={() => {
                  setActiveMenu(null);
                  setTheme(value);
                }}
              >
                {currentTheme === value && (
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                )}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Aide */}
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={activeMenu === "aide"}
          aria-haspopup="menu"
          onClick={() => toggleMenu("aide")}
        >
          Aide
        </button>
        {activeMenu === "aide" && (
          <div className={styles.dropdown} role="menu">
            <p className={styles.emptyHint}>Bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
