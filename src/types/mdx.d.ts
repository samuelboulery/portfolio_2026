declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { ProjectFrontmatter } from "@/content/projects.types";

  export const frontmatter: ProjectFrontmatter;
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
