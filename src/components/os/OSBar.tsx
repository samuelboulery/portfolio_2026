"use client";

import { Power } from "lucide-react";
import { useEffect, useState } from "react";
import { formatOsBarDate } from "@/lib/formatDate";
import styles from "./OSBar.module.css";

export function OSBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <button type="button" className={styles.iconButton} aria-label="Menu système">
          <Power size={14} />
        </button>
        <span className={styles.label}>Samuel Boulery</span>
      </div>
      <div className={styles.right}>
        <span className={styles.time} suppressHydrationWarning>
          {now ? formatOsBarDate(now) : ""}
        </span>
      </div>
    </header>
  );
}
