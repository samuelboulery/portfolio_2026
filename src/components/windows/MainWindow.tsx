"use client";

import { Mail } from "lucide-react";
import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/window/Window";
import { CONTACT_EMAIL } from "@/content/projects.config";
import { useWindowStore } from "@/stores/windowStore";
import styles from "./MainWindow.module.css";

interface MainWindowProps {
  id?: string;
}

export function MainWindow({ id = "main" }: MainWindowProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleOpenCv = () => {
    openWindow({ id: "cv", type: "cv", title: "curriculum_vitae" });
  };

  const handleContact = () => {
    if (typeof window === "undefined") return;
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  return (
    <Window id={id} title="System Designer">
      <div className={styles.content}>
        <Title as="h1" size="xl">
          Samuel Boulery
        </Title>
        <Paragraph size="l" tone="muted">
          System Designer & Token Architect chez EDF (CBTW). J&apos;orchestre des design systems
          tenables : tokens, gouvernance, cohérence produit.
        </Paragraph>
        <div className={styles.actions}>
          <Button variant="plain" onClick={handleOpenCv}>
            En savoir plus
          </Button>
          <Button
            variant="outlined"
            icon={<Mail size={18} aria-hidden="true" />}
            onClick={handleContact}
          >
            Me contacter
          </Button>
        </div>
      </div>
    </Window>
  );
}
