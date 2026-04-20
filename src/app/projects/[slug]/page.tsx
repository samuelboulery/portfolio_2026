import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/windows/mdxComponents";
import { PROJECTS } from "@/content/projects.config";
import { getProjectMdx } from "@/content/projects.mdx";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProjectMdx(slug);
  if (!entry) return {};
  const { frontmatter } = entry;
  return {
    title: `${frontmatter.title} — Samuel Boulery`,
    description: frontmatter.subtitle,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const entry = getProjectMdx(slug);
  if (!entry) notFound();

  const { Component, frontmatter } = entry;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "var(--space-xl)" }}>
      <article>
        <header>
          <h1>{frontmatter.title}</h1>
          {frontmatter.subtitle ? <p>{frontmatter.subtitle}</p> : null}
        </header>
        <Component components={mdxComponents} />
        {frontmatter.tags.length > 0 ? (
          <ul aria-label="Tags">
            {frontmatter.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </main>
  );
}
