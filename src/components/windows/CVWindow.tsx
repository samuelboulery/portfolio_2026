"use client";

import { Download } from "lucide-react";
import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/window/Window";
import { CV_DOWNLOAD_HREF, CV_SECTIONS, type CVItem } from "@/content/cv";
import styles from "./CVWindow.module.css";

interface CVWindowProps {
  id?: string;
}

export function CVWindow({ id = "cv" }: CVWindowProps) {
  const handleDownload = () => {
    if (typeof window === "undefined") return;
    window.open(CV_DOWNLOAD_HREF, "_blank", "noopener,noreferrer");
  };

  return (
    <Window id={id} title="curriculum_vitae.html">
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <Title as="h1" size="l">
              Curriculum vitae
            </Title>
            <Paragraph size="m" tone="muted">
              Samuel Boulery — System Designer & Token Architect
            </Paragraph>
          </div>
          <Button
            variant="outlined"
            size="s"
            icon={<Download size={16} aria-hidden="true" />}
            onClick={handleDownload}
            aria-label="Télécharger le CV en PDF"
          >
            Télécharger
          </Button>
        </header>

        {CV_SECTIONS.map((section) => (
          <section key={section.id} className={styles.section} aria-labelledby={`cv-${section.id}`}>
            <h2 id={`cv-${section.id}`} className={styles.sectionTitle}>
              {section.title}
            </h2>
            <ul className={styles.timeline}>
              {section.items.map((item) => (
                <CVEntry key={`${section.id}-${item.title}-${item.period}`} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Window>
  );
}

interface CVEntryProps {
  item: CVItem;
}

function CVEntry({ item }: CVEntryProps) {
  return (
    <li className={styles.item}>
      {item.period ? <p className={styles.period}>{item.period}</p> : null}
      <p className={styles.itemTitle}>
        {item.href ? (
          <a href={item.href} className={styles.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </p>
      {item.subtitle ? <p className={styles.subtitle}>{item.subtitle}</p> : null}
    </li>
  );
}
