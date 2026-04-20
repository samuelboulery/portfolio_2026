import {
  CONTACT_EMAIL,
  EXTERNAL_LINKS,
  PROJECTS,
  type ProjectMeta,
} from "@/content/projects.config";
import {
  ADAMS_QUOTE,
  COFFEE_ART,
  CREDITS_LINES,
  FORTUNES,
  HACK_LINES,
  RM_RF_STAGES,
  renderCowsay,
  renderFiglet,
  SUDO_REFUSAL,
  TEAPOT_ART,
} from "@/lib/terminal/easterEggs";
import {
  findByName,
  findDir,
  findNode,
  INITIAL_CWD,
  pathToLabel,
  resolvePath,
  type TerminalEffect,
  VFS_ROOT,
  type VfsDir,
  type VfsFile,
  type VfsNode,
} from "@/lib/terminal/fs";

export type { AnimationSpec, TerminalEffect } from "@/lib/terminal/fs";

export type TerminalTargetKind = "project" | "doc" | "external";

export interface TerminalTarget {
  readonly slug: string;
  readonly label: string;
  readonly kind: TerminalTargetKind;
  readonly effect: TerminalEffect;
}

export type OutputLine =
  | { readonly kind: "command"; readonly text: string }
  | { readonly kind: "result"; readonly text: string }
  | { readonly kind: "error"; readonly text: string };

export interface ParsedCommand {
  readonly command: string;
  readonly args: readonly string[];
}

export interface CommandResult {
  readonly output: readonly OutputLine[];
  readonly effect?: TerminalEffect;
  readonly cwdChange?: readonly string[];
}

const BUILTIN_COMMANDS = [
  "ls",
  "cd",
  "pwd",
  "cat",
  "help",
  "clear",
  "open",
  "whoami",
  "echo",
  "sudo",
  "cowsay",
  "figlet",
  "fortune",
  "42",
  "matrix",
  "hack",
  "coffee",
  "tea",
  "tree",
  "date",
  "uptime",
  "exit",
  "logout",
  "credits",
  "whoareyou",
  "rm",
] as const;

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function project(slug: string): ProjectMeta {
  const p = PROJECTS.find((entry) => entry.slug === slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return p;
}

function projectTarget(p: ProjectMeta): TerminalTarget {
  return {
    slug: p.slug,
    label: p.terminalLine,
    kind: "project",
    effect: { kind: "openProject", slug: p.slug, title: p.name },
  };
}

export const TERMINAL_TARGETS: readonly TerminalTarget[] = [
  {
    slug: "linkedin",
    label: "linkedin.url",
    kind: "external",
    effect: { kind: "openUrl", url: EXTERNAL_LINKS.linkedin },
  },
  projectTarget(project("edf")),
  {
    slug: "contact",
    label: "Contact",
    kind: "external",
    effect: { kind: "openUrl", url: `mailto:${CONTACT_EMAIL}` },
  },
  {
    slug: "design-society",
    label: "The Design Society",
    kind: "external",
    effect: { kind: "openUrl", url: EXTERNAL_LINKS.designSociety },
  },
  {
    slug: "friend-of-figma-lyon",
    label: "Friend of Figma Lyon",
    kind: "external",
    effect: { kind: "openUrl", url: EXTERNAL_LINKS.friendOfFigmaLyon },
  },
  projectTarget(project("bonum")),
  projectTarget(project("mazars")),
  projectTarget(project("greenweez")),
  {
    slug: "cv",
    label: "curriculum_vitae.html",
    kind: "doc",
    effect: { kind: "openCv" },
  },
];

export const INITIAL_TERMINAL_CWD = INITIAL_CWD;

export function parseCommand(raw: string): ParsedCommand {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const [command = "", ...args] = parts;
  return { command: command.toLowerCase(), args };
}

export function matchTarget(token: string): TerminalTarget | null {
  const normalized = normalize(token);
  if (!normalized) return null;
  for (const target of TERMINAL_TARGETS) {
    if (target.slug === normalized) return target;
    if (normalize(target.label) === normalized) return target;
  }
  return null;
}

const HELP_ENTRIES: ReadonlyArray<{ name: string; desc: string }> = [
  { name: "ls [path]", desc: "liste le répertoire (ls -a inclut les cachés)" },
  { name: "cd <path>", desc: "change de répertoire (. .. ~ chemins absolus/relatifs)" },
  { name: "pwd", desc: "affiche le chemin courant" },
  { name: "cat <file>", desc: "affiche ou ouvre une entrée" },
  { name: "tree [path]", desc: "arbre du répertoire" },
  { name: "open <nom>", desc: "ouvre une cible par nom (projet, cv, lien...)" },
  { name: "whoami", desc: "qui es-tu ?" },
  { name: "echo <str>", desc: "répète le texte passé" },
  { name: "date", desc: "date et heure courantes" },
  { name: "uptime", desc: "temps depuis l'ouverture du terminal" },
  { name: "credits", desc: "à propos de ce portfolio" },
  { name: "help", desc: "affiche cette aide" },
  { name: "clear", desc: "efface le terminal" },
  { name: "exit", desc: "ferme le terminal" },
];

const FUN_HELP_ENTRIES: ReadonlyArray<{ name: string; desc: string }> = [
  { name: "fortune", desc: "une citation au hasard" },
  { name: "cowsay <str>", desc: "la vache a quelque chose à dire" },
  { name: "figlet <str>", desc: "bannière ASCII" },
  { name: "matrix", desc: "…" },
  { name: "hack", desc: "…" },
  { name: "coffee", desc: "☕" },
  { name: "tea", desc: "🫖 (RFC 2324)" },
  { name: "42", desc: "?" },
];

function listDir(dir: VfsDir, showHidden: boolean): readonly OutputLine[] {
  const visible = dir.children.filter((child) => showHidden || !child.hidden);
  if (visible.length === 0) {
    return [{ kind: "result", text: "(vide)" }];
  }
  return visible.map((child) => ({
    kind: "result",
    text: child.kind === "dir" ? `${child.name}/` : child.name,
  }));
}

function renderTree(node: VfsNode, prefix: string, isLast: boolean, depth: number): string[] {
  if (depth === 0) {
    const lines: string[] = [node.kind === "dir" ? `${node.name}/` : node.name];
    if (node.kind === "dir") {
      const visible = node.children.filter((child) => !child.hidden);
      visible.forEach((child, i) => {
        lines.push(...renderTree(child, "", i === visible.length - 1, depth + 1));
      });
    }
    return lines;
  }
  const connector = isLast ? "└── " : "├── ";
  const name = node.kind === "dir" ? `${node.name}/` : node.name;
  const line = `${prefix}${connector}${name}`;
  const lines: string[] = [line];
  if (node.kind === "dir") {
    const childPrefix = `${prefix}${isLast ? "    " : "│   "}`;
    const visible = node.children.filter((child) => !child.hidden);
    visible.forEach((child, i) => {
      lines.push(...renderTree(child, childPrefix, i === visible.length - 1, depth + 1));
    });
  }
  return lines;
}

function formatUptime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `up ${seconds} second${seconds === 1 ? "" : "s"}`;
  return `up ${minutes} minute${minutes === 1 ? "" : "s"}, ${seconds} second${seconds === 1 ? "" : "s"}`;
}

function applyFileEffect(file: VfsFile): CommandResult {
  if (file.effect) {
    return {
      output: [{ kind: "result", text: `[ouverture de ${file.name}]` }],
      effect: file.effect,
    };
  }
  if (typeof file.content === "string") {
    return { output: [{ kind: "result", text: file.content }] };
  }
  return { output: [{ kind: "error", text: `cat: ${file.name}: contenu indisponible` }] };
}

export interface RunCommandContext {
  readonly mountedAt: number;
}

export function runCommand(
  parsed: ParsedCommand,
  cwd: readonly string[] = INITIAL_CWD,
  ctx?: RunCommandContext,
): CommandResult {
  const { command, args } = parsed;

  if (command === "") return { output: [] };

  if (command === "ls") {
    const showHidden = args.includes("-a");
    const pathArgs = args.filter((a) => a !== "-a");
    const token = pathArgs.join(" ").trim();
    const targetPath = token ? resolvePath(cwd, token) : cwd;
    if (!targetPath) {
      return { output: [{ kind: "error", text: `ls: cible introuvable: ${token}` }] };
    }
    const node = findNode(targetPath);
    if (!node) {
      return { output: [{ kind: "error", text: `ls: cible introuvable: ${token}` }] };
    }
    if (node.kind === "file") {
      return { output: [{ kind: "result", text: node.name }] };
    }
    return { output: listDir(node, showHidden) };
  }

  if (command === "cd") {
    const token = args.join(" ").trim();
    if (!token || token === "~") {
      return { output: [], cwdChange: [] };
    }
    const targetPath = resolvePath(cwd, token);
    if (!targetPath) {
      return { output: [{ kind: "error", text: `cd: aucun répertoire: ${token}` }] };
    }
    const node = findNode(targetPath);
    if (!node || node.kind !== "dir") {
      return { output: [{ kind: "error", text: `cd: pas un répertoire: ${token}` }] };
    }
    return { output: [], cwdChange: targetPath };
  }

  if (command === "pwd") {
    return { output: [{ kind: "result", text: pathToLabel(cwd) }] };
  }

  if (command === "cat") {
    const token = args.join(" ").trim();
    if (!token) {
      return { output: [{ kind: "error", text: "usage: cat <file>" }] };
    }
    const targetPath = resolvePath(cwd, token);
    if (!targetPath) {
      return { output: [{ kind: "error", text: `cat: ${token}: aucun fichier` }] };
    }
    const node = findNode(targetPath);
    if (!node) {
      return { output: [{ kind: "error", text: `cat: ${token}: aucun fichier` }] };
    }
    if (node.kind === "dir") {
      return { output: [{ kind: "error", text: `cat: ${token}: est un répertoire` }] };
    }
    return applyFileEffect(node);
  }

  if (command === "help") {
    return {
      output: [
        ...HELP_ENTRIES.map(
          ({ name, desc }): OutputLine => ({
            kind: "result",
            text: `  ${name.padEnd(14, " ")} ${desc}`,
          }),
        ),
        { kind: "result", text: "" },
        { kind: "result", text: "--- fun ---" },
        ...FUN_HELP_ENTRIES.map(
          ({ name, desc }): OutputLine => ({
            kind: "result",
            text: `  ${name.padEnd(14, " ")} ${desc}`,
          }),
        ),
      ],
    };
  }

  if (command === "clear") {
    return { output: [], effect: { kind: "clear" } };
  }

  if (command === "whoami") {
    return { output: [{ kind: "result", text: "guest@portfolio" }] };
  }

  if (command === "echo") {
    return { output: [{ kind: "result", text: args.join(" ") }] };
  }

  if (command === "open") {
    const token = args.join(" ");
    if (!token) {
      return { output: [{ kind: "error", text: "usage: open <nom>" }] };
    }
    const byTarget = matchTarget(token);
    if (byTarget) {
      return {
        output: [{ kind: "result", text: `[ouverture de ${byTarget.label}]` }],
        effect: byTarget.effect,
      };
    }
    const byPath = resolvePath(cwd, token);
    if (byPath) {
      const node = findNode(byPath);
      if (node && node.kind === "file") return applyFileEffect(node);
    }
    const byName = findByName(token);
    if (byName) return applyFileEffect(byName);
    return { output: [{ kind: "error", text: `open: cible introuvable: ${token}` }] };
  }

  if (command === "sudo") {
    return { output: [{ kind: "result", text: SUDO_REFUSAL }] };
  }

  if (command === "cowsay") {
    return { output: [{ kind: "result", text: renderCowsay(args.join(" ")) }] };
  }

  if (command === "figlet") {
    const text = args.join(" ");
    const rendered = renderFiglet(text);
    if (!rendered) {
      return { output: [{ kind: "error", text: "usage: figlet <texte>" }] };
    }
    return { output: [{ kind: "result", text: rendered }] };
  }

  if (command === "fortune") {
    const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return { output: [{ kind: "result", text: pick }] };
  }

  if (command === "42") {
    return { output: [{ kind: "result", text: ADAMS_QUOTE }] };
  }

  if (command === "matrix") {
    return {
      output: [],
      effect: {
        kind: "animation",
        spec: { variant: "matrix", durationMs: 3000 },
      },
    };
  }

  if (command === "hack") {
    return {
      output: [],
      effect: {
        kind: "animation",
        spec: { variant: "hack", lines: HACK_LINES, lineIntervalMs: 400 },
      },
    };
  }

  if (command === "coffee") {
    return { output: [{ kind: "result", text: COFFEE_ART }] };
  }

  if (command === "tea") {
    return { output: [{ kind: "result", text: TEAPOT_ART }] };
  }

  if (command === "tree") {
    const token = args.join(" ").trim();
    const targetPath = token ? resolvePath(cwd, token) : cwd;
    if (!targetPath) {
      return { output: [{ kind: "error", text: `tree: cible introuvable: ${token}` }] };
    }
    const node = findNode(targetPath);
    if (!node) {
      return { output: [{ kind: "error", text: `tree: cible introuvable: ${token}` }] };
    }
    const lines = renderTree(node, "", true, 0);
    return { output: lines.map((text) => ({ kind: "result", text })) };
  }

  if (command === "date") {
    const formatted = new Date().toLocaleString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { output: [{ kind: "result", text: formatted }] };
  }

  if (command === "uptime") {
    if (!ctx) {
      return { output: [{ kind: "result", text: "up 0 seconds" }] };
    }
    const ms = Date.now() - ctx.mountedAt;
    return { output: [{ kind: "result", text: formatUptime(ms) }] };
  }

  if (command === "exit" || command === "logout") {
    return {
      output: [{ kind: "result", text: "Au revoir." }],
      effect: { kind: "closeTerminal" },
    };
  }

  if (command === "credits" || command === "whoareyou") {
    return {
      output: [],
      effect: {
        kind: "animation",
        spec: { variant: "scroll", lines: CREDITS_LINES, lineIntervalMs: 80 },
      },
    };
  }

  if (command === "rm") {
    const isRoot = args.includes("-rf") && args.some((a) => a === "/" || a === "~" || a === "~/");
    if (isRoot) {
      return {
        output: [],
        effect: {
          kind: "animation",
          spec: { variant: "staged", stages: RM_RF_STAGES },
        },
      };
    }
    return { output: [{ kind: "error", text: "rm: refuse de supprimer quoi que ce soit ici." }] };
  }

  const shortcutToken = [command, ...args].join(" ");
  const directTarget = matchTarget(shortcutToken);
  if (directTarget) {
    return {
      output: [{ kind: "result", text: `[ouverture de ${directTarget.label}]` }],
      effect: directTarget.effect,
    };
  }

  const shortcutPath = resolvePath(cwd, command);
  if (shortcutPath && args.length === 0) {
    const node = findNode(shortcutPath);
    if (node && node.kind === "file") return applyFileEffect(node);
  }

  const shortcutByName = findByName(command);
  if (shortcutByName && args.length === 0) return applyFileEffect(shortcutByName);

  return { output: [{ kind: "error", text: `command not found: ${command}` }] };
}

function completeVfsAt(
  cwd: readonly string[],
  input: string,
  onlyDirs: boolean,
): readonly string[] {
  const trimmed = input;
  const lastSlash = trimmed.lastIndexOf("/");
  const dirToken = lastSlash === -1 ? "" : trimmed.slice(0, lastSlash);
  const leaf = lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1);

  let basePath: readonly string[] | null = cwd;
  if (dirToken) {
    basePath = resolvePath(cwd, dirToken);
  } else if (trimmed.startsWith("~")) {
    basePath = [];
  }
  if (!basePath) return [];

  const dir = findDir(basePath);
  if (!dir) return [];

  const prefix = dirToken ? `${dirToken}/` : "";
  const showHidden = leaf.startsWith(".");
  const candidates: string[] = [];
  for (const child of dir.children) {
    if (onlyDirs && child.kind !== "dir") continue;
    if (child.hidden && !showHidden) continue;
    if (!child.name.startsWith(leaf)) continue;
    const suffix = child.kind === "dir" ? `${child.name}/` : child.name;
    candidates.push(`${prefix}${suffix}`);
  }
  return candidates;
}

export function completeInput(
  raw: string,
  cwd: readonly string[] = INITIAL_CWD,
): readonly string[] {
  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const rest = raw.slice(leading.length);
  const tokens = rest.split(/\s+/);

  if (tokens.length <= 1) {
    const prefix = (tokens[0] ?? "").toLowerCase();
    const candidates = new Set<string>();
    for (const cmd of BUILTIN_COMMANDS) {
      if (cmd.startsWith(prefix)) candidates.add(cmd);
    }
    for (const target of TERMINAL_TARGETS) {
      if (target.slug.startsWith(prefix)) candidates.add(target.slug);
    }
    return Array.from(candidates);
  }

  const [cmd, ...rest2] = tokens;
  const argInput = rest2.join(" ");

  if (cmd === "cd") {
    return completeVfsAt(cwd, argInput, true).map((v) => `cd ${v}`);
  }
  if (cmd === "cat" || cmd === "ls") {
    return completeVfsAt(cwd, argInput, false).map((v) => `${cmd} ${v}`);
  }
  if (cmd === "open") {
    const prefix = argInput.toLowerCase();
    const candidates = new Set<string>();
    for (const target of TERMINAL_TARGETS) {
      if (target.slug.startsWith(prefix)) candidates.add(`open ${target.slug}`);
    }
    for (const path of flattenFileNames()) {
      if (path.startsWith(prefix)) candidates.add(`open ${path}`);
    }
    return Array.from(candidates);
  }

  return [];
}

function flattenFileNames(): readonly string[] {
  const out: string[] = [];
  const queue: VfsNode[] = [VFS_ROOT];
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    if (node.kind === "file") out.push(node.name);
    else queue.push(...node.children);
  }
  return out;
}

export function commonPrefix(values: readonly string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const v of values.slice(1)) {
    while (!v.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}
