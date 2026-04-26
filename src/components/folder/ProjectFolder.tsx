"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import type { ProjectMeta } from "@/content/projects.config";
import { projectWindowId } from "@/content/projects.config";
import { selectWindow, useWindowStore } from "@/stores/windowStore";

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
    <FileIcon
      kind="folder"
      label={project.folderLabel}
      selected={isActive}
      ariaLabel={`Ouvrir le projet ${project.name}`}
      onClick={handleOpen}
      onDoubleClick={handleOpen}
    />
  );
}
