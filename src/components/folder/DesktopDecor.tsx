"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./DesktopDecor.module.css";

export function DesktopDecor() {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleOpenFinder = () => {
    openWindow({
      id: "finder",
      type: "finder",
      title: "Macintosh HD",
      initialPosition: { x: 220, y: 90 },
      initialSize: { width: 560, height: 400 },
    });
  };

  return (
    <>
      <div className={styles.hd}>
        <FileIcon
          kind="hd"
          label="Macintosh HD"
          ariaLabel="Macintosh HD"
          onDoubleClick={handleOpenFinder}
          onClick={handleOpenFinder}
        />
      </div>
      <div className={styles.trash}>
        <FileIcon kind="trash" label="Trash" ariaLabel="Trash" />
      </div>
    </>
  );
}
