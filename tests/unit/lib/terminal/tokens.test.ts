import { describe, expect, it } from "vitest";
import { lastToken, replaceLastToken } from "@/lib/terminal/tokens";

describe("lastToken", () => {
  it("retourne le dernier token après un espace", () => {
    expect(lastToken("cd pro")).toBe("pro");
  });

  it("retourne une chaîne vide quand l'input finit par un espace", () => {
    expect(lastToken("cd ")).toBe("");
  });

  it("retourne une chaîne vide pour un input vide", () => {
    expect(lastToken("")).toBe("");
  });

  it("retourne l'input complet quand il n'y a pas d'espace", () => {
    expect(lastToken("cd")).toBe("cd");
  });

  it("gère plusieurs tokens", () => {
    expect(lastToken("cat ~/.secrets/note")).toBe("~/.secrets/note");
  });
});

describe("replaceLastToken", () => {
  it("remplace le dernier token", () => {
    expect(replaceLastToken("cd pro", "projects/")).toBe("cd projects/");
  });

  it("ajoute le token quand l'input finit par un espace", () => {
    expect(replaceLastToken("cd ", "projects/")).toBe("cd projects/");
  });

  it("remplace depuis un input vide", () => {
    expect(replaceLastToken("", "ls")).toBe("ls");
  });

  it("préserve les tokens précédents", () => {
    expect(replaceLastToken("cat ~/.sec", "~/.secrets/")).toBe("cat ~/.secrets/");
  });

  it("remplace un seul token", () => {
    expect(replaceLastToken("c", "cd")).toBe("cd");
  });
});
