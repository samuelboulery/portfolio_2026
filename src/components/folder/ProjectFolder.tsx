"use client";

import type { ProjectMeta } from "@/content/projects.config";
import { projectWindowId } from "@/content/projects.config";
import { selectWindow, useWindowStore } from "@/stores/windowStore";
import { FolderTab } from "./FolderTab";
import styles from "./ProjectFolder.module.css";

interface ProjectFolderProps {
  project: ProjectMeta;
}

export function ProjectFolder({ project }: ProjectFolderProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windowState = useWindowStore(selectWindow(projectWindowId(project.slug)));
  const isActive = Boolean(windowState?.isOpen && !windowState.isMinimized);

  const handleOpen = () => {
    openWindow({
      id: projectWindowId(project.slug),
      type: "project",
      title: project.name,
      meta: { slug: project.slug },
    });
  };

  return (
    <button
      type="button"
      className={styles.folder}
      data-active={isActive}
      onDoubleClick={handleOpen}
      onClick={handleOpen}
      aria-label={`Ouvrir le projet ${project.name}`}
    >
      <span className={styles.shape} aria-hidden="true">
        <span className={styles.body} />
        <FolderTab className={styles.tab} />
      </span>
      <span className={styles.name}>{project.folderLabel}</span>
    </button>
  );
}
