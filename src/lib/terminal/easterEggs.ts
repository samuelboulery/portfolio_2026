export const FORTUNES: readonly string[] = [
  "« Good design is as little design as possible. » — Dieter Rams",
  "« Perfection is attained, not when nothing more can be added, but when nothing more can be removed. » — Antoine de Saint-Exupéry",
  "« Typography is the detail and the practice of design. » — Massimo Vignelli",
  "« Perfect typography is more a science than an art. » — Jan Tschichold",
  "« When in doubt, use brute force. » — Ken Thompson",
  "« A little copying is better than a little dependency. » — Rob Pike",
  "« Naming things is hard. So is cache invalidation. » — Phil Karlton",
  "« Un token nommé par sa valeur meurt dès que la valeur change. »",
  "« Le design system n'est pas une bibliothèque de composants. C'est une discipline. »",
  "« Premature abstraction is the root of all token debt. »",
  "« Il y a deux types de designers : ceux qui versionnent leurs fichiers, et ceux qui vont y venir. »",
  "« Simplicity is about subtracting the obvious and adding the meaningful. » — John Maeda",
  "« Le design, c'est comme un bon parfum : on le remarque quand il est mauvais. »",
  "« Tout système assez complexe contient une feuille Excel qu'on n'ose plus ouvrir. »",
  "« Ship it. Le perfectionnisme est un luxe qu'on s'offre après la release. »",
];

export function renderCowsay(text: string): string {
  const message = text.trim() || "Moo.";
  const maxWidth = 40;
  const words = message.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length === 0) {
      current = word;
      continue;
    }
    if (current.length + 1 + word.length > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }
  if (current.length > 0) lines.push(current);

  const width = lines.reduce((w, l) => Math.max(w, l.length), 0);
  const top = ` ${"_".repeat(width + 2)}`;
  const bottom = ` ${"-".repeat(width + 2)}`;

  const bubble: string[] = [top];
  if (lines.length === 1) {
    bubble.push(`< ${lines[0].padEnd(width, " ")} >`);
  } else {
    lines.forEach((line, i) => {
      const left = i === 0 ? "/" : i === lines.length - 1 ? "\\" : "|";
      const right = i === 0 ? "\\" : i === lines.length - 1 ? "/" : "|";
      bubble.push(`${left} ${line.padEnd(width, " ")} ${right}`);
    });
  }
  bubble.push(bottom);

  const cow = [
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];

  return [...bubble, ...cow].join("\n");
}

export const FIGLET_HEIGHT = 5;

export const FIGLET_MAP: Readonly<Record<string, readonly string[]>> = {
  A: [" ▄▀█ ", "▀▀▀▀▀", "█▀▀▀█", "█   █", "▀   ▀"],
  B: ["█▀▀▄ ", "█▀▀▄ ", "█▄▄▀ ", "     ", "     "],
  C: [" ▄▀▀█", "█    ", "█    ", " ▀▄▄▀", "     "],
  D: ["█▀▀▄ ", "█   █", "█   █", "█▄▄▀ ", "     "],
  E: ["█▀▀▀", "█▀▀ ", "█▄▄▄", "    ", "    "],
  F: ["█▀▀▀", "█▀▀ ", "█   ", "    ", "    "],
  G: [" ▄▀▀█", "█    ", "█ ▀█ ", " ▀▄▄▀", "     "],
  H: ["█   █", "█▄▄▄█", "█   █", "     ", "     "],
  I: ["█", "█", "█", " ", " "],
  J: ["   █", "   █", "█  █", " ▀▀ ", "    "],
  K: ["█  █ ", "█▄▀  ", "█ ▀▄ ", "     ", "     "],
  L: ["█   ", "█   ", "█▄▄▄", "    ", "    "],
  M: ["█▄ ▄█", "█ ▀ █", "█   █", "     ", "     "],
  N: ["█▄  █", "█ ▀▄█", "█  ▀█", "     ", "     "],
  O: [" ▄▀▀▄ ", "█    █", "█    █", " ▀▄▄▀ ", "      "],
  P: ["█▀▀▄ ", "█▄▄▀ ", "█    ", "     ", "     "],
  Q: [" ▄▀▀▄ ", "█    █", "█  █▄█", " ▀▄▄█ ", "      "],
  R: ["█▀▀▄ ", "█▄▄▀ ", "█ ▀▄ ", "     ", "     "],
  S: [" ▄▀▀▀", "▀▀▄  ", "▄▄▄▀ ", "     ", "     "],
  T: ["▀▀█▀▀", "  █  ", "  █  ", "     ", "     "],
  U: ["█   █", "█   █", " ▀▄▀ ", "     ", "     "],
  V: ["█   █", " █ █ ", "  ▀  ", "     ", "     "],
  W: ["█   █", "█ ▄ █", " ▀ ▀ ", "     ", "     "],
  X: ["█ █", " ▀ ", "█ █", "   ", "   "],
  Y: ["█   █", " ▀▄▀ ", "  █  ", "     ", "     "],
  Z: ["▀▀▀█", "  ▀ ", "█▄▄▄", "    ", "    "],
  "0": [" ▄▀▀▄ ", "█    █", "█    █", " ▀▄▄▀ ", "      "],
  "1": [" █ ", "▀█ ", " █ ", "▄█▄", "   "],
  "2": ["▄▀▀▄", "  ▄▀", "▄▀  ", "▀▀▀▀", "    "],
  "3": ["▄▀▀▄", "  ▄▀", "▄  ▀", " ▀▀ ", "    "],
  "4": ["█  █", "█▄▄█", "   █", "    ", "    "],
  "5": ["█▀▀▀", "▀▀▄ ", "▄▄▄▀", "    ", "    "],
  "6": [" ▄▀▀", "█▀▀▄", "█▄▄▀", "    ", "    "],
  "7": ["▀▀▀█", "  ▄▀", " █  ", "    ", "    "],
  "8": ["▄▀▀▄", " ▀▀ ", "▄▀▀▄", " ▀▀ ", "    "],
  "9": ["▄▀▀▄", "▀▄▄█", "  ▄▀", "    ", "    "],
  " ": ["   ", "   ", "   ", "   ", "   "],
  "!": ["█", "█", " ", "█", " "],
  "?": ["▀▀▄", " ▄▀", "   ", " █ ", "   "],
  "—": ["   ", "   ", "▀▀▀", "   ", "   "],
  "-": ["   ", "   ", "▀▀▀", "   ", "   "],
  ".": [" ", " ", " ", " ", "█"],
};

export function renderFiglet(text: string): string {
  const upper = text.trim().toUpperCase().slice(0, 20);
  if (!upper) return "";
  const rows: string[] = Array.from({ length: FIGLET_HEIGHT }, () => "");
  for (const char of upper) {
    const glyph = FIGLET_MAP[char] ?? FIGLET_MAP[" "];
    for (let i = 0; i < FIGLET_HEIGHT; i += 1) {
      rows[i] = `${rows[i]}${glyph[i]} `;
    }
  }
  return rows.join("\n");
}

export const MATRIX_CHARS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

export const HACK_LINES: readonly string[] = [
  "Scanning subnet 192.168.1.0/24 ...",
  "Fingerprinting target OS ... Linux 5.x detected",
  "Bypassing firewall rules [####------] 40%",
  "Bypassing firewall rules [########--] 80%",
  "Injecting payload via port 443 ...",
  "Dumping /etc/shadow ... (nope, joking)",
  "Cleaning logs ...",
  "ACCESS GRANTED ✓",
];

export const COFFEE_ART = `      ( (
       ) )
    .______.
    |      |]
    \\      /
     '----'
Brewing... ☕ Ready. (Ne contient ni lait ni JavaScript.)`;

export const TEAPOT_ART = `         ;,'
 _o_    ;:;'
,-.'---\`.__ ;
((j'=====',-'
 \`-\\     /
    \`-=-'
HTTP 418 — I'm a teapot. (RFC 2324)`;

export const CREDITS_LINES: readonly string[] = [
  "Samuel Boulery — System Designer & Token Architect",
  "",
  "Outils :",
  "  • Figma (Variables, Code Connect, Make)",
  "  • Style Dictionary, Tokens Studio",
  "  • Next.js, TypeScript, CSS Modules",
  "",
  "Valeurs :",
  "  • Les tokens se conçoivent, ne se cataloguent pas",
  "  • Un design system n'est pas une bibliothèque",
  "  • Le nom survit à la valeur",
  "",
  "Merci d'être passé.",
];

export const RM_RF_STAGES: readonly { readonly text: string; readonly delayMs: number }[] = [
  { text: "rm: removing /...", delayMs: 150 },
  { text: "[#---------] deleting system32 ...", delayMs: 250 },
  { text: "[####------] shredding tokens ...", delayMs: 250 },
  { text: "[######----] purging node_modules ...", delayMs: 250 },
  { text: "[########--] burning the cloud ...", delayMs: 250 },
  { text: "[##########] done.", delayMs: 200 },
  { text: "Haha. Rien n'a bougé. Ton portfolio est tenace.", delayMs: 0 },
];

export const SUDO_REFUSAL =
  "[sudo] password for guest: \nNice try. guest n'est pas dans le fichier sudoers. Cet incident sera signalé à l'administrateur système. — xkcd #149";

export const ADAMS_QUOTE = "The answer to life, the universe, and everything. — Douglas Adams";
