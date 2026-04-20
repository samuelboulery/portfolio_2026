"use client";

import { Paragraph } from "@/components/typography/Paragraph";
import { Title } from "@/components/typography/Title";
import { Tag } from "@/components/ui/Tag";
import { Window } from "@/components/window/Window";
import { projectWindowId } from "@/content/projects.config";
import { getProjectMdx } from "@/content/projects.mdx";
import styles from "./ProjectWindow.module.css";

interface ProjectWindowProps {
  slug: string;
}

export function ProjectWindow({ slug }: ProjectWindowProps) {
  const entry = getProjectMdx(slug);
  if (!entry) return null;

  const { Component, frontmatter } = entry;
  const id = projectWindowId(slug);

  return (
    <Window id={id} title={`${slug}.md`}>
      <article className={styles.article}>
        <header className={styles.header}>
          <Title as="h1" size="l">
            {frontmatter.title}
          </Title>
          {frontmatter.subtitle ? (
            <Paragraph size="m" tone="muted">
              {frontmatter.subtitle}
            </Paragraph>
          ) : null}
        </header>

        {frontmatter.coverImages.length > 0 ? (
          <div className={styles.covers}>
            {frontmatter.coverImages.map((cover) => (
              <figure key={cover.src} className={styles.cover}>
                {/* biome-ignore lint/performance/noImgElement: assets MDX arbitraires, next/image non requis */}
                <img src={cover.src} alt={cover.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        ) : null}

        <div className={styles.prose}>
          <Component />
        </div>

        {frontmatter.tags.length > 0 ? (
          <ul className={styles.tags} aria-label="Tags">
            {frontmatter.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </Window>
  );
}
