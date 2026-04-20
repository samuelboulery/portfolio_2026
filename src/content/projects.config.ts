export interface ProjectMeta {
  slug: string;
  name: string;
  subtitle?: string;
  terminalLine: string;
  folderLabel: string;
  order: number;
}

export const PROJECTS: readonly ProjectMeta[] = [
  {
    slug: "edf",
    name: "EDF",
    subtitle: "Design System",
    terminalLine: "edf.md",
    folderLabel: "EDF",
    order: 1,
  },
  {
    slug: "mazars",
    name: "Mazars",
    subtitle: "Brand refresh",
    terminalLine: "mazars.md",
    folderLabel: "Mazars",
    order: 2,
  },
  {
    slug: "bonum",
    name: "Bonum",
    subtitle: "Product design",
    terminalLine: "bonum.md",
    folderLabel: "Bonum",
    order: 3,
  },
  {
    slug: "greenweez",
    name: "Greenweez",
    subtitle: "E-commerce redesign",
    terminalLine: "greenweez.md",
    folderLabel: "Greenweez",
    order: 4,
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    subtitle: "This site",
    terminalLine: "portfolio.md",
    folderLabel: "Portfolio",
    order: 5,
  },
];

export const EXTERNAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/samuel-boulery/",
} as const;

export const CONTACT_EMAIL = "samboulery@gmail.com";

export function projectWindowId(slug: string): string {
  return `project:${slug}`;
}
