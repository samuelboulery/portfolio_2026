"use client";

import { useEffect, useState } from "react";
import { formatOsBarDate } from "@/lib/formatDate";
import { AppleMenu } from "./AppleMenu";
import styles from "./OSBar.module.css";
import { SpecialMenu } from "./SpecialMenu";
import { TopMenuBar } from "./TopMenuBar";

interface OSBarProps {
  onShutdown: () => void;
  onRestart: () => void;
  onAbout: () => void;
  onOpenFinder?: () => void;
}

export function OSBar({ onShutdown, onRestart, onAbout, onOpenFinder }: OSBarProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <AppleMenu onAbout={onAbout} />
        <TopMenuBar onQuit={onShutdown} onOpenFinder={onOpenFinder} />
      </div>
      <div className={styles.right}>
        <SpecialMenu onRestart={onRestart} onShutdown={onShutdown} />
        <span className={styles.time} suppressHydrationWarning>
          {now ? formatOsBarDate(now) : ""}
        </span>
      </div>
    </header>
  );
}
