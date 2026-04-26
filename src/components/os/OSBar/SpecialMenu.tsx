"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./SpecialMenu.module.css";

interface SpecialMenuProps {
  onRestart: () => void;
  onShutdown: () => void;
}

interface SpecialItem {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface SpecialSection {
  id: string;
  items: ReadonlyArray<SpecialItem>;
}

export function SpecialMenu({ onRestart, onShutdown }: SpecialMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => setOpen(false), []);
  useClickOutside(ref, handleClickOutside);

  const handleSelect = (callback?: () => void) => {
    setOpen(false);
    callback?.();
  };

  const sections: ReadonlyArray<SpecialSection> = [
    {
      id: "power",
      items: [
        { label: "Restart", onSelect: onRestart },
        { label: "Shut Down", onSelect: onShutdown },
      ],
    },
    { id: "sleep", items: [{ label: "Sleep", disabled: true }] },
  ];

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        data-active={open || undefined}
        onClick={() => setOpen((v) => !v)}
      >
        Special
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
