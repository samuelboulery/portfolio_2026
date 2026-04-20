import { CONTACT_EMAIL, EXTERNAL_LINKS, PROJECTS } from "@/content/projects.config";

export type AnimationSpec =
  | { readonly variant: "matrix"; readonly durationMs: number }
  | {
      readonly variant: "hack";
      readonly lines: readonly string[];
      readonly lineIntervalMs: number;
    }
  | {
      readonly variant: "scroll";
      readonly lines: readonly string[];
      readonly lineIntervalMs: number;
    }
  | {
      readonly variant: "staged";
      readonly stages: readonly { readonly text: string; readonly delayMs: number }[];
    };

export type TerminalEffect =
  | { readonly kind: "openProject"; readonly slug: string; readonly title: string }
  | { readonly kind: "openCv" }
  | { readonly kind: "openUrl"; readonly url: string }
  | { readonly kind: "clear" }
  | { readonly kind: "closeTerminal" }
  | { readonly kind: "animation"; readonly spec: AnimationSpec };

export interface VfsFile {
  readonly kind: "file";
  readonly name: string;
  readonly content?: string;
  readonly effect?: TerminalEffect;
  readonly hidden?: boolean;
}

export interface VfsDir {
  readonly kind: "dir";
  readonly name: string;
  readonly children: readonly VfsNode[];
  readonly hidden?: boolean;
}

export type VfsNode = VfsFile | VfsDir;

function projectFile(slug: string): VfsFile {
  const p = PROJECTS.find((entry) => entry.slug === slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return {
    kind: "file",
    name: p.slug,
    effect: { kind: "openProject", slug: p.slug, title: p.name },
  };
}

export const VFS_ROOT: VfsDir = {
  kind: "dir",
  name: "~",
  children: [
    {
      kind: "dir",
      name: "projects",
      children: [
        projectFile("edf"),
        projectFile("bonum"),
        projectFile("mazars"),
        projectFile("greenweez"),
      ],
    },
    {
      kind: "dir",
      name: "links",
      children: [
        {
          kind: "file",
          name: "linkedin.url",
          effect: { kind: "openUrl", url: EXTERNAL_LINKS.linkedin },
        },
        {
          kind: "file",
          name: "design_society.url",
          effect: { kind: "openUrl", url: EXTERNAL_LINKS.designSociety },
        },
        {
          kind: "file",
          name: "friend_of_figma.url",
          effect: { kind: "openUrl", url: EXTERNAL_LINKS.friendOfFigmaLyon },
        },
      ],
    },
    {
      kind: "dir",
      name: "about",
      children: [
        {
          kind: "file",
          name: "contact.email",
          effect: { kind: "openUrl", url: `mailto:${CONTACT_EMAIL}` },
        },
        {
          kind: "file",
          name: "curriculum_vitae.html",
          effect: { kind: "openCv" },
        },
        {
          kind: "file",
          name: "whoami.txt",
          content: "Samuel Boulery — System Designer & Token Architect.",
        },
      ],
    },
    {
      kind: "dir",
      name: ".secrets",
      hidden: true,
      children: [
        {
          kind: "file",
          name: "note.txt",
          content:
            "« Un bon token est un token qu'on n'a pas besoin d'expliquer. »\n— note perso, quelque part entre Figma et Style Dictionary",
        },
        {
          kind: "file",
          name: "easter.txt",
          content:
            "Tu as trouvé les secrets. Bravo.\nIndice : essaye `matrix`, `hack`, `fortune`, `42`, `cowsay hello`.",
        },
      ],
    },
  ],
};

export const INITIAL_CWD: readonly string[] = ["projects"];

export function pathToLabel(path: readonly string[]): string {
  if (path.length === 0) return "~";
  return `~/${path.join("/")}`;
}

export function findNode(path: readonly string[]): VfsNode | null {
  let current: VfsNode = VFS_ROOT;
  for (const segment of path) {
    if (current.kind !== "dir") return null;
    const next: VfsNode | undefined = current.children.find((child) => child.name === segment);
    if (!next) return null;
    current = next;
  }
  return current;
}

export function findDir(path: readonly string[]): VfsDir | null {
  const node = findNode(path);
  if (!node || node.kind !== "dir") return null;
  return node;
}

/**
 * Résout `input` relativement à `cwd` et renvoie un chemin absolu (depuis `~`).
 * Retourne null si la destination n'existe pas.
 */
export function resolvePath(cwd: readonly string[], input: string): readonly string[] | null {
  const trimmed = input.trim();
  if (trimmed === "" || trimmed === "~") return [];

  let segments: string[];
  if (trimmed.startsWith("~/")) {
    segments = trimmed.slice(2).split("/").filter(Boolean);
    const resolved: string[] = [];
    for (const seg of segments) {
      if (seg === ".") continue;
      if (seg === "..") {
        if (resolved.length > 0) resolved.pop();
        continue;
      }
      resolved.push(seg);
    }
    return findNode(resolved) ? resolved : null;
  }

  if (trimmed.startsWith("/")) {
    segments = trimmed.slice(1).split("/").filter(Boolean);
  } else {
    segments = [...cwd, ...trimmed.split("/").filter(Boolean)];
  }

  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === ".") continue;
    if (seg === "..") {
      if (resolved.length > 0) resolved.pop();
      continue;
    }
    resolved.push(seg);
  }

  return findNode(resolved) ? resolved : null;
}

export function findByName(name: string): VfsFile | null {
  const normalized = name.trim();
  if (!normalized) return null;

  const queue: VfsNode[] = [VFS_ROOT];
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    if (node.kind === "file" && node.name === normalized) return node;
    if (node.kind === "dir") queue.push(...node.children);
  }
  return null;
}
