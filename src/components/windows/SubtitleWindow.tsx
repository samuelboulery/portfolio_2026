"use client";

import { Title } from "@/components/typography/Title";
import { Window } from "@/components/window/Window";
import styles from "./SubtitleWindow.module.css";

interface SubtitleWindowProps {
  id?: string;
}

export function SubtitleWindow({ id = "subtitle" }: SubtitleWindowProps) {
  return (
    <Window id={id} title="UX-UI">
      <div className={styles.content}>
        <Title as="h2" size="l" muted>
          &amp; UX-UI Designer
        </Title>
      </div>
    </Window>
  );
}
