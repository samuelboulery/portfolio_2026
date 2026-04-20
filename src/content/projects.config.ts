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
    terminalLine: "Design System EDF",
    folderLabel: "EDF",
    order: 1,
  },
  {
    slug: "mazars",
    name: "Mazars",
    subtitle: "Brand refresh",
    terminalLine: "Sprint Mazars",
    folderLabel: "Mazars",
    order: 2,
  },
  {
    slug: "bonum",
    name: "Bonum",
    subtitle: "Product design",
    terminalLine: "Sprint Bonum",
    folderLabel: "Bonum",
    order: 3,
  },
  {
    slug: "greenweez",
    name: "Greenweez",
    subtitle: "E-commerce redesign",
    terminalLine: "Design System Greenweez",
    folderLabel: "Greenweez",
    order: 4,
  },
];

export const EXTERNAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/samuel-boulery/",
  designSociety: "https://thedesignsociety.fr/",
  friendOfFigmaLyon: "https://friends.figma.com/lyon/",
} as const;

export const CONTACT_EMAIL = "samboulery@gmail.com";

export function projectWindowId(slug: string): string {
  return `project:${slug}`;
}
