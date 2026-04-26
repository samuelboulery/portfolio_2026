"use client";

import { useState } from "react";
import { FileIcon, type FileIconKind } from "@/components/ui/FileIcon";
import { Window } from "@/components/window/Window";
import { WindowStatusBar } from "@/components/window/WindowStatusBar";
import { PROJECTS, projectWindowId } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./FinderWindow.module.css";

interface FinderEntry {
  id: string;
  kind: FileIconKind;
  label: string;
  onOpen: () => void;
}

export function FinderWindow() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries: ReadonlyArray<FinderEntry> = [
    ...PROJECTS.map((project) => ({
      id: `project:${project.slug}`,
      kind: "folder" as FileIconKind,
      label: project.folderLabel,
      onOpen: () =>
        openWindow({
          id: projectWindowId(project.slug),
          type: "project",
          title: project.name,
          meta: { slug: project.slug },
        }),
    })),
    {
      id: "doc:cv",
      kind: "document",
      label: "curriculum_vitae.html",
      onOpen: () =>
        openWindow({
          id: "cv",
          type: "cv",
          title: "curriculum_vitae.html",
          initialPosition: { x: 200, y: 150 },
        }),
    },
    {
      id: "exec:terminal",
      kind: "executable",
      label: "CommandShell",
      onOpen: () =>
        openWindow({
          id: "terminal",
          type: "terminal",
          title: "CommandShell 1",
          initialPosition: { x: 320, y: 200 },
        }),
    },
    {
      id: "doc:ascii",
      kind: "document",
      label: "image.ascii",
      onOpen: () =>
        openWindow({
          id: "image",
          type: "image",
          title: "image.ascii",
          initialPosition: { x: 280, y: 100 },
        }),
    },
  ];

  const segments: ReadonlyArray<string> = [
    `${entries.length} items`,
    "12.3 MB in disk",
    "487 MB available",
  ];

  return (
    <Window
      id="finder"
      title="Macintosh HD"
      showContentPadding={false}
      statusBar={<WindowStatusBar segments={segments} />}
    >
      <ul className={styles.grid}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.cell} data-file-id={entry.id}>
            <FileIcon
              kind={entry.kind}
              label={entry.label}
              selected={selectedId === entry.id}
              onClick={() => setSelectedId(entry.id)}
              onDoubleClick={() => {
                setSelectedId(entry.id);
                entry.onOpen();
              }}
            />
          </li>
        ))}
      </ul>
    </Window>
  );
}
