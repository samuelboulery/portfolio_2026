"use client";

import { Download } from "lucide-react";
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
          <Title as="h1" size="l">
            Curriculum vitae
          </Title>
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
            <Title as="h2" size="s" id={`cv-${section.id}`}>
              {section.title}
            </Title>
            <ul className={styles.timeline}>
              {section.items.map((item) => (
                <CVEntry key={`${section.id}-${item.period}-${item.title}`} item={item} />
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
    <li className={styles.row}>
      <span className={styles.period}>{item.period}</span>
      <div className={styles.jobInfo}>
        <p className={styles.itemTitle}>
          {item.href ? <MaybeLink href={item.href}>{item.title}</MaybeLink> : item.title}
        </p>
        {item.subtitle ? (
          <p className={styles.subtitle}>
            {item.subtitleHref ? (
              <MaybeLink href={item.subtitleHref}>{item.subtitle}</MaybeLink>
            ) : (
              item.subtitle
            )}
          </p>
        ) : null}
      </div>
    </li>
  );
}

interface MaybeLinkProps {
  href: string;
  children: React.ReactNode;
}

function MaybeLink({ href, children }: MaybeLinkProps) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={styles.link}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
