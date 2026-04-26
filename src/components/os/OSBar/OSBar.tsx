"use client";

import { useEffect, useState } from "react";
import { formatOsBarDate } from "@/lib/formatDate";
import styles from "./OSBar.module.css";
import { PowerMenu } from "./PowerMenu";
import { TopMenuBar } from "./TopMenuBar";

interface OSBarProps {
  onShutdown: () => void;
  onRestart: () => void;
}

export function OSBar({ onShutdown, onRestart }: OSBarProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <PowerMenu onShutdown={onShutdown} onRestart={onRestart} />
        <span className={styles.separator} aria-hidden="true" />
        <TopMenuBar />
      </div>
      <div className={styles.right}>
        <span className={styles.time} suppressHydrationWarning>
          {now ? formatOsBarDate(now) : ""}
        </span>
      </div>
    </header>
  );
}
