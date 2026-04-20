export interface ProjectCoverImage {
  src: string;
  alt: string;
}

export interface ProjectFrontmatter {
  title: string;
  subtitle?: string;
  tags: readonly string[];
  coverImages: readonly ProjectCoverImage[];
  order: number;
}
