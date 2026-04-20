"use client";

import { useMemo } from "react";
import { EXTERNAL_LINKS } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import { Dock, type DockAppId } from "./Dock";

export function DockBridge() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const windows = useWindowStore((state) => state.windows);

  const activeIds = useMemo<readonly DockAppId[]>(() => {
    const active: DockAppId[] = [];
    if (windows.main?.isOpen && !windows.main.isMinimized) active.push("home");
    if (windows.cv?.isOpen && !windows.cv.isMinimized) active.push("cv");
    if (windows.image?.isOpen && !windows.image.isMinimized) active.push("image");
    if (windows.terminal?.isOpen && !windows.terminal.isMinimized) active.push("terminal");
    const hasOpenProject = Object.values(windows).some(
      (w) => w.type === "project" && w.isOpen && !w.isMinimized,
    );
    if (hasOpenProject) active.push("folder");
    return active;
  }, [windows]);

  const handleAppClick = (id: DockAppId) => {
    switch (id) {
      case "home":
        openWindow({ id: "main", type: "main", title: "System Designer" });
        focusWindow("main");
        break;
      case "cv":
        openWindow({ id: "cv", type: "cv", title: "curriculum_vitae" });
        focusWindow("cv");
        break;
      case "image":
        openWindow({ id: "image", type: "image", title: "image.ascii" });
        focusWindow("image");
        break;
      case "terminal":
        openWindow({ id: "terminal", type: "terminal", title: "terminal" });
        focusWindow("terminal");
        break;
      case "folder":
        restoreWindow("main");
        break;
      case "linkedin":
        if (typeof window !== "undefined") {
          window.open(EXTERNAL_LINKS.linkedin, "_blank", "noopener,noreferrer");
        }
        break;
    }
  };

  return <Dock activeIds={activeIds} onAppClick={handleAppClick} />;
}
