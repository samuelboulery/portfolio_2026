"use client";

import { useEffect } from "react";
import { FoldersGrid } from "@/components/folder/FoldersGrid";
import { Desktop } from "@/components/os/Desktop";
import { CVWindow } from "@/components/windows/CVWindow";
import { ImageWindow } from "@/components/windows/ImageWindow";
import { MainWindow } from "@/components/windows/MainWindow";
import { ProjectWindow } from "@/components/windows/ProjectWindow";
import { SubtitleWindow } from "@/components/windows/SubtitleWindow";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { PROJECTS } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./Scene.module.css";

const BASE_WINDOWS = [
  {
    id: "main",
    type: "main" as const,
    title: "System Designer",
    initialPosition: { x: 310, y: 24 },
  },
  {
    id: "subtitle",
    type: "subtitle" as const,
    title: "UX-UI",
    initialPosition: { x: 350, y: 288 },
  },
  {
    id: "image",
    type: "image" as const,
    title: "image.ascii",
    initialPosition: { x: 310, y: 420 },
  },
  {
    id: "terminal",
    type: "terminal" as const,
    title: "terminal",
    initialPosition: { x: 820, y: 80 },
  },
];

function resolveInitialPositions() {
  if (typeof window === "undefined") return BASE_WINDOWS;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 1920) return BASE_WINDOWS;
  const col1x = Math.round(vw * 0.21);
  const col2x = Math.round(vw * 0.56);
  return [
    { ...BASE_WINDOWS[0], initialPosition: { x: col1x, y: 24 } },
    { ...BASE_WINDOWS[1], initialPosition: { x: col1x + 40, y: Math.round(vh * 0.44) } },
    { ...BASE_WINDOWS[2], initialPosition: { x: col1x, y: Math.round(vh * 0.62) } },
    { ...BASE_WINDOWS[3], initialPosition: { x: col2x, y: 80 } },
  ];
}

export function Scene() {
  const openWindow = useWindowStore((state) => state.openWindow);

  useEffect(() => {
    const { windows } = useWindowStore.getState();
    const configs = resolveInitialPositions();
    for (const config of configs) {
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
      <CVWindow />
      {PROJECTS.map((project) => (
        <ProjectWindow key={project.slug} slug={project.slug} />
      ))}
    </Desktop>
  );
}
