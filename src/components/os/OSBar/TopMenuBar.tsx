"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { selectFocusedId, useWindowStore } from "@/stores/windowStore";
import styles from "./TopMenuBar.module.css";

type MenuId = "file" | "edit" | "view";

interface MenuItem {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface MenuSection {
  id: string;
  items: ReadonlyArray<MenuItem>;
}

interface TopMenuBarProps {
  onQuit: () => void;
  onOpenFinder?: () => void;
}

export function TopMenuBar({ onQuit, onOpenFinder }: TopMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const focusedId = useWindowStore(selectFocusedId);
  const closeWindow = useWindowStore((state) => state.closeWindow);

  const handleClickOutside = useCallback(() => setActiveMenu(null), []);
  useClickOutside(ref, handleClickOutside);

  function toggleMenu(id: MenuId) {
    setActiveMenu((prev) => (prev === id ? null : id));
  }

  function handleSelect(callback?: () => void) {
    setActiveMenu(null);
    callback?.();
  }

  const fileSections: ReadonlyArray<MenuSection> = [
    {
      id: "open",
      items: [
        {
          label: "Open",
          shortcut: "⌘O",
          onSelect: onOpenFinder,
          disabled: !onOpenFinder,
        },
      ],
    },
    {
      id: "close",
      items: [
        {
          label: "Close",
          shortcut: "⌘W",
          onSelect: () => focusedId && closeWindow(focusedId),
          disabled: !focusedId,
        },
      ],
    },
    {
      id: "quit",
      items: [{ label: "Quit", shortcut: "⌘Q", onSelect: onQuit }],
    },
  ];

  const editSections: ReadonlyArray<MenuSection> = [
    {
      id: "edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", disabled: true },
        { label: "Cut", shortcut: "⌘X", disabled: true },
        { label: "Copy", shortcut: "⌘C", disabled: true },
        { label: "Paste", shortcut: "⌘V", disabled: true },
      ],
    },
  ];

  const viewSections: ReadonlyArray<MenuSection> = [
    {
      id: "view",
      items: [
        { label: "By Icon", disabled: true },
        { label: "By Name", disabled: true },
        { label: "By Date", disabled: true },
      ],
    },
  ];

  function renderSections(sections: ReadonlyArray<MenuSection>) {
    return sections.map((section, sectionIndex) => (
      <Fragment key={section.id}>
        {sectionIndex > 0 ? <hr className={styles.separator} /> : null}
        {section.items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={styles.item}
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            onClick={() => handleSelect(item.onSelect)}
          >
            <span className={styles.itemLabel}>{item.label}</span>
            {item.shortcut ? <span className={styles.shortcut}>{item.shortcut}</span> : null}
          </button>
        ))}
      </Fragment>
    ));
  }

  function renderMenu(id: MenuId, label: string, sections: ReadonlyArray<MenuSection>) {
    const isOpen = activeMenu === id;
    return (
      <div className={styles.menuItem}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          data-active={isOpen || undefined}
          onClick={() => toggleMenu(id)}
        >
          {label}
        </button>
        {isOpen && (
          <div className={styles.dropdown} role="menu">
            {renderSections(sections)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.root} ref={ref}>
      {renderMenu("file", "File", fileSections)}
      {renderMenu("edit", "Edit", editSections)}
      {renderMenu("view", "View", viewSections)}
    </div>
  );
}
