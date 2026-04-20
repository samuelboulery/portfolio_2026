"use client";

import { useEffect } from "react";
import { FoldersGrid } from "@/components/folder/FoldersGrid";
import { Desktop } from "@/components/os/Desktop";
import { ImageWindow } from "@/components/windows/ImageWindow";
import { MainWindow } from "@/components/windows/MainWindow";
import { SubtitleWindow } from "@/components/windows/SubtitleWindow";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./Scene.module.css";

const DEFAULT_WINDOWS = [
  {
    id: "main",
    type: "main" as const,
    title: "System Designer",
    initialPosition: { x: 40, y: 24 },
  },
  {
    id: "subtitle",
    type: "subtitle" as const,
    title: "UX-UI",
    initialPosition: { x: 80, y: 288 },
  },
  {
    id: "image",
    type: "image" as const,
    title: "image.ascii",
    initialPosition: { x: 40, y: 420 },
  },
  {
    id: "terminal",
    type: "terminal" as const,
    title: "terminal",
    initialPosition: { x: 540, y: 80 },
  },
];

export function Scene() {
  const openWindow = useWindowStore((state) => state.openWindow);

  useEffect(() => {
    const { windows } = useWindowStore.getState();
    for (const config of DEFAULT_WINDOWS) {
      if (!windows[config.id]) {
        openWindow(config);
      }
    }
  }, [openWindow]);

  return (
    <Desktop>
      <aside className={styles.foldersPanel} aria-label="Projets disponibles">
        <FoldersGrid />
      </aside>
      <MainWindow />
      <SubtitleWindow />
      <ImageWindow />
      <TerminalWindow />
    </Desktop>
  );
}
