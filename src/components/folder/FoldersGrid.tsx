"use client";

import { PROJECTS } from "@/content/projects.config";
import styles from "./FoldersGrid.module.css";
import { ProjectFolder } from "./ProjectFolder";

export function FoldersGrid() {
  return (
    <div className={styles.grid}>
      {PROJECTS.map((project) => (
        <ProjectFolder key={project.slug} project={project} />
      ))}
    </div>
  );
}
