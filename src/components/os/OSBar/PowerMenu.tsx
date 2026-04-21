"use client";

import { Power } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./PowerMenu.module.css";

interface PowerMenuProps {
  onShutdown: () => void;
  onRestart: () => void;
}

export function PowerMenu({ onShutdown, onRestart }: PowerMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Menu système"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Power size={14} />
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false);
              onRestart();
            }}
          >
            Redémarrer
          </button>
          <hr className={styles.separator} />
          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.itemDanger}`}
            onClick={() => {
              setOpen(false);
              onShutdown();
            }}
          >
            Éteindre
          </button>
        </div>
      )}
    </div>
  );
}
