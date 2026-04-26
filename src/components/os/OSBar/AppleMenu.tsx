"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { FinderIcon } from "@/components/ui/icons/FinderIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./AppleMenu.module.css";

interface AppleMenuProps {
  onAbout: () => void;
}

interface AppleMenuItem {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface AppleMenuSection {
  id: string;
  items: ReadonlyArray<AppleMenuItem>;
}

const STATIC_DISABLED_APPS: ReadonlyArray<AppleMenuItem> = [
  { label: "Calculator", disabled: true },
  { label: "Alarm Clock", disabled: true },
  { label: "Chooser", disabled: true },
  { label: "Control Panels", disabled: true },
  { label: "Key Caps", disabled: true },
  { label: "Note Pad", disabled: true },
  { label: "Puzzle", disabled: true },
  { label: "Scrapbook", disabled: true },
];

export function AppleMenu({ onAbout }: AppleMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleClickOutside = useCallback(() => setOpen(false), []);
  useClickOutside(ref, handleClickOutside);

  const handleSelect = (callback?: () => void) => {
    setOpen(false);
    callback?.();
  };

  const sections: ReadonlyArray<AppleMenuSection> = [
    { id: "about", items: [{ label: "About this Macintosh…", onSelect: onAbout }] },
    {
      id: "shell",
      items: [
        {
          label: "CommandShell",
          onSelect: () =>
            openWindow({
              id: "terminal",
              type: "terminal",
              title: "CommandShell 1",
              initialPosition: { x: 320, y: 200 },
            }),
        },
      ],
    },
    { id: "apps", items: STATIC_DISABLED_APPS },
  ];

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Menu Apple"
        aria-expanded={open}
        aria-haspopup="menu"
        data-active={open || undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <FinderIcon kind="apple" size={14} />
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          {sections.map((section, sectionIndex) => (
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
                  {item.label}
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
