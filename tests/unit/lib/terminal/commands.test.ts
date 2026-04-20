import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/content/projects.config";
import {
  commonPrefix,
  completeInput,
  matchTarget,
  parseCommand,
  runCommand,
} from "@/lib/terminal/commands";
import { ADAMS_QUOTE, FORTUNES, SUDO_REFUSAL } from "@/lib/terminal/easterEggs";

describe("parseCommand", () => {
  it("extrait commande et arguments", () => {
    expect(parseCommand("open edf")).toEqual({ command: "open", args: ["edf"] });
  });

  it("tolère espaces multiples et en entête/fin", () => {
    expect(parseCommand("   open    design society  ")).toEqual({
      command: "open",
      args: ["design", "society"],
    });
  });

  it("retourne une commande vide pour une saisie blanche", () => {
    expect(parseCommand("   ")).toEqual({ command: "", args: [] });
  });

  it("met la commande en minuscules", () => {
    expect(parseCommand("LS")).toEqual({ command: "ls", args: [] });
  });
});

describe("matchTarget", () => {
  it("trouve une cible par slug", () => {
    const target = matchTarget("edf");
    expect(target?.slug).toBe("edf");
  });

  it("trouve une cible par label exact", () => {
    const target = matchTarget("curriculum_vitae.html");
    expect(target?.slug).toBe("cv");
  });

  it("insensible à la casse", () => {
    const target = matchTarget("Design System EDF");
    expect(target?.slug).toBe("edf");
  });

  it("normalise les espaces multiples", () => {
    const target = matchTarget("  The   Design   Society ");
    expect(target?.slug).toBe("design-society");
  });

  it("retourne null pour un token inconnu", () => {
    expect(matchTarget("xyz")).toBeNull();
  });

  it("retourne null pour une chaîne vide", () => {
    expect(matchTarget("")).toBeNull();
  });
});

describe("runCommand", () => {
  it("ls dans cwd par défaut (~/projects) liste les 4 projets", () => {
    const result = runCommand(parseCommand("ls"));
    expect(result.output.length).toBe(PROJECTS.length);
    expect(result.output.every((l) => l.kind === "result")).toBe(true);
    expect(result.effect).toBeUndefined();
    for (const project of PROJECTS) {
      expect(result.output.some((l) => l.text === project.slug)).toBe(true);
    }
  });

  it("ls ~ affiche les dossiers racine", () => {
    const result = runCommand(parseCommand("ls ~"));
    const texts = result.output.map((l) => l.text);
    expect(texts).toContain("projects/");
    expect(texts).toContain("links/");
    expect(texts).toContain("about/");
  });

  it("ls ~/unknown renvoie une erreur", () => {
    const result = runCommand(parseCommand("ls ~/unknown"));
    expect(result.output[0]).toMatchObject({ kind: "error" });
  });

  it("pwd affiche le chemin courant", () => {
    const result = runCommand(parseCommand("pwd"), ["about"]);
    expect(result.output[0]).toMatchObject({ kind: "result", text: "~/about" });
  });

  it("cd .. remonte d'un niveau", () => {
    const result = runCommand(parseCommand("cd .."), ["projects"]);
    expect(result.cwdChange).toEqual([]);
  });

  it("cd ~ revient à la racine", () => {
    const result = runCommand(parseCommand("cd ~"), ["about"]);
    expect(result.cwdChange).toEqual([]);
  });

  it("cd about navigue vers ~/about", () => {
    const result = runCommand(parseCommand("cd about"), []);
    expect(result.cwdChange).toEqual(["about"]);
  });

  it("cd vers fichier renvoie une erreur", () => {
    const result = runCommand(parseCommand("cd curriculum_vitae.html"), ["about"]);
    expect(result.output[0]).toMatchObject({ kind: "error" });
    expect(result.cwdChange).toBeUndefined();
  });

  it("cat whoami.txt affiche le contenu", () => {
    const result = runCommand(parseCommand("cat whoami.txt"), ["about"]);
    expect(result.output[0]).toMatchObject({ kind: "result" });
    expect(result.output[0].text).toContain("Samuel Boulery");
    expect(result.effect).toBeUndefined();
  });

  it("cat curriculum_vitae.html déclenche openCv", () => {
    const result = runCommand(parseCommand("cat curriculum_vitae.html"), ["about"]);
    expect(result.effect).toEqual({ kind: "openCv" });
  });

  it("cat sur un dossier renvoie une erreur", () => {
    const result = runCommand(parseCommand("cat about"), []);
    expect(result.output[0]).toMatchObject({ kind: "error" });
  });

  it("cat sans argument renvoie l'usage", () => {
    const result = runCommand(parseCommand("cat"), ["about"]);
    expect(result.output[0]).toMatchObject({ kind: "error" });
    expect(result.output[0].text).toContain("usage");
  });

  it("whoami renvoie guest@portfolio", () => {
    const result = runCommand(parseCommand("whoami"));
    expect(result.output[0]).toMatchObject({ kind: "result", text: "guest@portfolio" });
  });

  it("echo répète les arguments", () => {
    const result = runCommand(parseCommand("echo bonjour le monde"));
    expect(result.output[0]).toMatchObject({ kind: "result", text: "bonjour le monde" });
  });

  it("help liste les commandes disponibles", () => {
    const result = runCommand(parseCommand("help"));
    expect(result.output.length).toBeGreaterThan(0);
    expect(result.output.every((l) => l.kind === "result")).toBe(true);
    expect(result.output.some((l) => l.text.includes("ls"))).toBe(true);
    expect(result.output.some((l) => l.text.includes("open"))).toBe(true);
  });

  it("clear produit un effect clear sans sortie", () => {
    const result = runCommand(parseCommand("clear"));
    expect(result.output).toEqual([]);
    expect(result.effect).toEqual({ kind: "clear" });
  });

  it("open edf déclenche l'effect openProject", () => {
    const result = runCommand(parseCommand("open edf"));
    expect(result.effect).toMatchObject({ kind: "openProject", slug: "edf" });
  });

  it("open cv déclenche openCv", () => {
    const result = runCommand(parseCommand("open cv"));
    expect(result.effect).toEqual({ kind: "openCv" });
  });

  it("open linkedin déclenche openUrl", () => {
    const result = runCommand(parseCommand("open linkedin"));
    expect(result.effect?.kind).toBe("openUrl");
  });

  it("open sans argument retourne une erreur", () => {
    const result = runCommand(parseCommand("open"));
    expect(result.output[0]).toMatchObject({ kind: "error" });
    expect(result.effect).toBeUndefined();
  });

  it("open cible introuvable retourne une erreur", () => {
    const result = runCommand(parseCommand("open xyz"));
    expect(result.output[0]).toMatchObject({ kind: "error" });
    expect(result.output[0].text).toContain("xyz");
  });

  it("nom direct (edf) équivaut à open edf", () => {
    const result = runCommand(parseCommand("edf"));
    expect(result.effect).toMatchObject({ kind: "openProject", slug: "edf" });
  });

  it("commande inconnue retourne command not found", () => {
    const result = runCommand(parseCommand("xyz"));
    expect(result.output[0]).toMatchObject({ kind: "error" });
    expect(result.output[0].text).toContain("command not found");
    expect(result.output[0].text).toContain("xyz");
  });

  it("commande vide retourne output vide", () => {
    const result = runCommand(parseCommand(""));
    expect(result.output).toEqual([]);
    expect(result.effect).toBeUndefined();
  });
});

describe("easter eggs", () => {
  it("sudo ls renvoie le message de refus xkcd", () => {
    const result = runCommand(parseCommand("sudo ls"));
    expect(result.output[0]).toMatchObject({ kind: "result", text: SUDO_REFUSAL });
  });

  it("42 renvoie la citation Douglas Adams", () => {
    const result = runCommand(parseCommand("42"));
    expect(result.output[0]).toMatchObject({ kind: "result", text: ADAMS_QUOTE });
  });

  it("cowsay hello produit une bulle contenant hello", () => {
    const result = runCommand(parseCommand("cowsay hello"));
    expect(result.output[0].kind).toBe("result");
    expect(result.output[0].text).toContain("hello");
    expect(result.output[0].text).toContain("(oo)");
  });

  it("cowsay sans argument produit Moo.", () => {
    const result = runCommand(parseCommand("cowsay"));
    expect(result.output[0].text).toContain("Moo.");
  });

  it("fortune renvoie une citation du catalogue", () => {
    const result = runCommand(parseCommand("fortune"));
    expect(result.output[0].kind).toBe("result");
    expect(FORTUNES).toContain(result.output[0].text);
  });

  it("figlet hi produit un art ASCII", () => {
    const result = runCommand(parseCommand("figlet hi"));
    expect(result.output[0].kind).toBe("result");
    expect(result.output[0].text.split("\n").length).toBe(5);
  });

  it("figlet sans argument renvoie l'usage", () => {
    const result = runCommand(parseCommand("figlet"));
    expect(result.output[0].kind).toBe("error");
  });

  it("matrix renvoie un effect animation", () => {
    const result = runCommand(parseCommand("matrix"));
    expect(result.effect).toMatchObject({
      kind: "animation",
      spec: { variant: "matrix", durationMs: 3000 },
    });
  });

  it("hack renvoie un effect animation avec les lignes HACK", () => {
    const result = runCommand(parseCommand("hack"));
    expect(result.effect?.kind).toBe("animation");
    if (result.effect?.kind === "animation" && result.effect.spec.variant === "hack") {
      expect(result.effect.spec.lines.length).toBeGreaterThan(0);
    }
  });

  it("coffee affiche l'art ASCII tasse", () => {
    const result = runCommand(parseCommand("coffee"));
    expect(result.output[0].text).toContain("Brewing");
  });

  it("tea affiche l'art ASCII théière", () => {
    const result = runCommand(parseCommand("tea"));
    expect(result.output[0].text).toContain("418");
  });

  it("tree affiche l'arbre du répertoire avec connecteurs", () => {
    const result = runCommand(parseCommand("tree"), []);
    const joined = result.output.map((l) => l.text).join("\n");
    expect(joined).toContain("├──");
    expect(joined).toContain("projects");
    expect(joined).toContain("links");
    expect(joined).toContain("about");
  });

  it("tree projects affiche le sous-arbre", () => {
    const result = runCommand(parseCommand("tree projects"), []);
    const joined = result.output.map((l) => l.text).join("\n");
    expect(joined).toContain("edf");
    expect(joined).not.toContain("about");
  });

  it("date produit une chaîne non vide", () => {
    const result = runCommand(parseCommand("date"));
    expect(result.output[0].kind).toBe("result");
    expect(result.output[0].text.length).toBeGreaterThan(0);
  });

  it("uptime sans contexte retourne up 0 seconds", () => {
    const result = runCommand(parseCommand("uptime"));
    expect(result.output[0]).toMatchObject({ kind: "result", text: "up 0 seconds" });
  });

  it("uptime avec contexte formate la durée", () => {
    const ctx = { mountedAt: Date.now() - 65_000 };
    const result = runCommand(parseCommand("uptime"), [], ctx);
    expect(result.output[0].text).toMatch(/up 1 minute, \d+ seconds?/);
  });

  it("exit renvoie l'effect closeTerminal", () => {
    const result = runCommand(parseCommand("exit"));
    expect(result.effect).toEqual({ kind: "closeTerminal" });
    expect(result.output[0].text).toBe("Au revoir.");
  });

  it("logout est alias de exit", () => {
    const result = runCommand(parseCommand("logout"));
    expect(result.effect).toEqual({ kind: "closeTerminal" });
  });

  it("credits déclenche un effect animation scroll", () => {
    const result = runCommand(parseCommand("credits"));
    expect(result.effect?.kind).toBe("animation");
    if (result.effect?.kind === "animation") {
      expect(result.effect.spec.variant).toBe("scroll");
    }
  });

  it("whoareyou est alias de credits", () => {
    const result = runCommand(parseCommand("whoareyou"));
    expect(result.effect?.kind).toBe("animation");
  });

  it("rm -rf / déclenche l'animation staged", () => {
    const result = runCommand(parseCommand("rm -rf /"));
    expect(result.effect?.kind).toBe("animation");
    if (result.effect?.kind === "animation") {
      expect(result.effect.spec.variant).toBe("staged");
    }
  });

  it("rm sans -rf refuse", () => {
    const result = runCommand(parseCommand("rm foo"));
    expect(result.output[0].kind).toBe("error");
    expect(result.effect).toBeUndefined();
  });

  it("ls -a sur ~ inclut .secrets", () => {
    const result = runCommand(parseCommand("ls -a ~"));
    const texts = result.output.map((l) => l.text);
    expect(texts).toContain(".secrets/");
  });

  it("ls ~ sans -a masque .secrets", () => {
    const result = runCommand(parseCommand("ls ~"));
    const texts = result.output.map((l) => l.text);
    expect(texts).not.toContain(".secrets/");
  });

  it("help inclut la section fun", () => {
    const result = runCommand(parseCommand("help"));
    const joined = result.output.map((l) => l.text).join("\n");
    expect(joined).toContain("--- fun ---");
    expect(joined).toContain("fortune");
  });
});

describe("completeInput", () => {
  it("retourne toutes les candidates pour une saisie vide", () => {
    const candidates = completeInput("");
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates).toContain("ls");
    expect(candidates).toContain("help");
    expect(candidates).toContain("edf");
  });

  it("retourne edf pour le préfixe ed", () => {
    const candidates = completeInput("ed");
    expect(candidates).toContain("edf");
  });

  it("retourne les cibles après open ", () => {
    const candidates = completeInput("open ed");
    expect(candidates).toContain("open edf");
  });

  it("retourne vide pour un préfixe sans match", () => {
    const candidates = completeInput("zzz");
    expect(candidates).toEqual([]);
  });
});

describe("commonPrefix", () => {
  it("retourne le préfixe commun le plus long", () => {
    expect(commonPrefix(["design", "designer", "design-system"])).toBe("design");
  });

  it("retourne la chaîne complète si un seul élément", () => {
    expect(commonPrefix(["edf"])).toBe("edf");
  });

  it("retourne une chaîne vide sans préfixe commun", () => {
    expect(commonPrefix(["abc", "xyz"])).toBe("");
  });

  it("retourne une chaîne vide pour un tableau vide", () => {
    expect(commonPrefix([])).toBe("");
  });
});
