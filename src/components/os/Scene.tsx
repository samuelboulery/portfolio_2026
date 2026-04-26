"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { DesktopDecor } from "@/components/folder/DesktopDecor";
import { FoldersGrid } from "@/components/folder/FoldersGrid";
import { BootScreen } from "@/components/os/BootScreen/BootScreen";
import { Desktop } from "@/components/os/Desktop";
import { OSBar } from "@/components/os/OSBar/OSBar";
import { ShutdownScreen } from "@/components/os/ShutdownScreen/ShutdownScreen";
import { AboutDialog } from "@/components/ui/Dialog/AboutDialog";
import { ConfirmDialog } from "@/components/ui/Dialog/ConfirmDialog";
import { CVWindow } from "@/components/windows/CVWindow";
import { FinderWindow } from "@/components/windows/FinderWindow";
import { ImageWindow } from "@/components/windows/ImageWindow";
import { MainWindow } from "@/components/windows/MainWindow";
import { ProjectWindow } from "@/components/windows/ProjectWindow";
import { SubtitleWindow } from "@/components/windows/SubtitleWindow";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { PROJECTS } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./Scene.module.css";

// Opened in order: back → front (last entry = highest z-index)
const BASE_WINDOWS = [
  {
    id: "image",
    type: "image" as const,
    title: "image.ascii",
    initialPosition: { x: 315, y: 73 },
  },
  {
    id: "main",
    type: "main" as const,
    title: "System Designer",
    initialPosition: { x: 83, y: 320 },
  },
  {
    id: "terminal",
    type: "terminal" as const,
    title: "terminal",
    initialPosition: { x: 930, y: 458 },
  },
  {
    id: "subtitle",
    type: "subtitle" as const,
    title: "UX-UI",
    initialPosition: { x: 522, y: 265 },
  },
];

function resolveInitialPositions() {
  if (typeof window === "undefined") return BASE_WINDOWS;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 1920) return BASE_WINDOWS;
  const col1x = Math.round(vw * 0.22);
  const col2x = Math.round(vw * 0.64);
  return [
    { ...BASE_WINDOWS[0], initialPosition: { x: col1x, y: 73 } },
    { ...BASE_WINDOWS[1], initialPosition: { x: Math.round(vw * 0.06), y: Math.round(vh * 0.4) } },
    { ...BASE_WINDOWS[2], initialPosition: { x: col2x, y: Math.round(vh * 0.56) } },
    { ...BASE_WINDOWS[3], initialPosition: { x: col1x + 200, y: Math.round(vh * 0.33) } },
  ];
}

export function Scene() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [bootDone, setBootDone] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [confirmShutdown, setConfirmShutdown] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const triggerShutdown = useCallback(() => {
    setConfirmShutdown(false);
    setIsShutdown(true);
  }, []);
  const triggerRestart = useCallback(() => {
    setConfirmRestart(false);
    sessionStorage.removeItem("boot-done");
    setIsShutdown(false);
    setBootDone(false);
  }, []);

  const handleShutdownRequest = useCallback(() => setConfirmShutdown(true), []);
  const handleRestartRequest = useCallback(() => setConfirmRestart(true), []);
  const handleAbout = useCallback(() => setAboutOpen(true), []);
  const handleOpenFinder = useCallback(
    () =>
      openWindow({
        id: "finder",
        type: "finder",
        title: "Macintosh HD",
        initialPosition: { x: 220, y: 90 },
        initialSize: { width: 560, height: 400 },
      }),
    [openWindow],
  );

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
    <>
      <OSBar
        onShutdown={handleShutdownRequest}
        onRestart={handleRestartRequest}
        onAbout={handleAbout}
        onOpenFinder={handleOpenFinder}
      />
      <AnimatePresence>
        {!bootDone && !isShutdown && <BootScreen key="boot" onDone={() => setBootDone(true)} />}
        {isShutdown && <ShutdownScreen key="shutdown" onRestart={triggerRestart} />}
      </AnimatePresence>
      {!isShutdown && (
        <Desktop>
          <aside className={styles.foldersPanel} aria-label="Projets disponibles">
            <FoldersGrid />
          </aside>
          <DesktopDecor />
          <MainWindow />
          <SubtitleWindow />
          <ImageWindow />
          <TerminalWindow />
          <CVWindow />
          <FinderWindow />
          {PROJECTS.map((project) => (
            <ProjectWindow key={project.slug} slug={project.slug} />
          ))}
        </Desktop>
      )}
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ConfirmDialog
        open={confirmShutdown}
        title="Shut Down"
        message="Vous voulez vraiment éteindre le portfolio ?"
        confirmLabel="Shut Down"
        onConfirm={triggerShutdown}
        onCancel={() => setConfirmShutdown(false)}
      />
      <ConfirmDialog
        open={confirmRestart}
        title="Restart"
        message="Redémarrer le portfolio ? Les fenêtres seront réinitialisées."
        confirmLabel="Restart"
        onConfirm={triggerRestart}
        onCancel={() => setConfirmRestart(false)}
      />
    </>
  );
}
