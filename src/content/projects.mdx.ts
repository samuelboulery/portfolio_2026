import type { ComponentType } from "react";
import Bonum, { frontmatter as bonumFrontmatter } from "../../content/projects/bonum.mdx";
import Edf, { frontmatter as edfFrontmatter } from "../../content/projects/edf.mdx";
import Greenweez, {
  frontmatter as greenweezFrontmatter,
} from "../../content/projects/greenweez.mdx";
import Mazars, { frontmatter as mazarsFrontmatter } from "../../content/projects/mazars.mdx";
import type { ProjectFrontmatter } from "./projects.types";

export interface ProjectMdx {
  Component: ComponentType<Record<string, unknown>>;
  frontmatter: ProjectFrontmatter;
}

export const PROJECTS_MDX: Readonly<Record<string, ProjectMdx>> = {
  edf: { Component: Edf, frontmatter: edfFrontmatter },
  mazars: { Component: Mazars, frontmatter: mazarsFrontmatter },
  bonum: { Component: Bonum, frontmatter: bonumFrontmatter },
  greenweez: { Component: Greenweez, frontmatter: greenweezFrontmatter },
};

export function getProjectMdx(slug: string): ProjectMdx | undefined {
  return PROJECTS_MDX[slug];
}
