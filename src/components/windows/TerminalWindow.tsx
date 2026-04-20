"use client";

import { Window } from "@/components/window/Window";
import { EXTERNAL_LINKS, PROJECTS, projectWindowId } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./TerminalWindow.module.css";

interface TerminalWindowProps {
  id?: string;
}

interface TerminalLine {
  key: string;
  label: string;
  onActivate: () => void;
  external?: boolean;
}

export function TerminalWindow({ id = "terminal" }: TerminalWindowProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const lines: readonly TerminalLine[] = [
    {
      key: "linkedin",
      label: "linkedin.url",
      onActivate: () => {
        if (typeof window !== "undefined") {
          window.open(EXTERNAL_LINKS.linkedin, "_blank", "noopener,noreferrer");
        }
      },
      external: true,
    },
    {
      key: "cv",
      label: "curriculum_vitae.html",
      onActivate: () => openWindow({ id: "cv", type: "cv", title: "curriculum_vitae" }),
    },
    ...PROJECTS.map(
      (project): TerminalLine => ({
        key: project.slug,
        label: project.terminalLine,
        onActivate: () =>
          openWindow({
            id: projectWindowId(project.slug),
            type: "project",
            title: project.name,
            meta: { slug: project.slug },
          }),
      }),
    ),
  ];

  return (
    <Window id={id} title="terminal">
      <div className={styles.terminal}>
        <p className={styles.prompt}>
          <span className={styles.promptSymbol}>→</span> ~{" "}
          <span className={styles.command}>ls</span>
        </p>
        <ul className={styles.list}>
          {lines.map((line) => (
            <li key={line.key}>
              <button
                type="button"
                className={styles.line}
                onClick={line.onActivate}
                aria-label={
                  line.external
                    ? `Ouvrir ${line.label} dans un nouvel onglet`
                    : `Ouvrir ${line.label}`
                }
              >
                {line.label}
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.prompt}>
          <span className={styles.promptSymbol}>→</span> ~{" "}
          <span className={styles.cursor} aria-hidden="true" />
        </p>
      </div>
    </Window>
  );
}
