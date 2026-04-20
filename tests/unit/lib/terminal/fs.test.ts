import { describe, expect, it } from "vitest";
import {
  findByName,
  findDir,
  findNode,
  INITIAL_CWD,
  pathToLabel,
  resolvePath,
  VFS_ROOT,
} from "@/lib/terminal/fs";

describe("pathToLabel", () => {
  it("retourne ~ pour un chemin vide", () => {
    expect(pathToLabel([])).toBe("~");
  });

  it("compose avec les segments", () => {
    expect(pathToLabel(["projects"])).toBe("~/projects");
    expect(pathToLabel(["about", "contact"])).toBe("~/about/contact");
  });
});

describe("findNode", () => {
  it("retourne la racine pour un chemin vide", () => {
    expect(findNode([])).toBe(VFS_ROOT);
  });

  it("trouve un dossier connu", () => {
    const node = findNode(["projects"]);
    expect(node?.kind).toBe("dir");
    expect(node?.name).toBe("projects");
  });

  it("trouve un fichier connu", () => {
    const node = findNode(["about", "curriculum_vitae.html"]);
    expect(node?.kind).toBe("file");
    expect(node?.name).toBe("curriculum_vitae.html");
  });

  it("retourne null pour un chemin inexistant", () => {
    expect(findNode(["xyz"])).toBeNull();
    expect(findNode(["projects", "inconnu"])).toBeNull();
  });

  it("retourne null si on descend dans un fichier", () => {
    expect(findNode(["about", "whoami.txt", "extra"])).toBeNull();
  });
});

describe("findDir", () => {
  it("retourne uniquement des dossiers", () => {
    expect(findDir(["projects"])?.kind).toBe("dir");
    expect(findDir(["about", "whoami.txt"])).toBeNull();
  });
});

describe("resolvePath", () => {
  it("chemin vide ou ~ renvoie la racine", () => {
    expect(resolvePath(["projects"], "")).toEqual([]);
    expect(resolvePath(["projects"], "~")).toEqual([]);
  });

  it("chemin relatif depuis cwd", () => {
    expect(resolvePath([], "projects")).toEqual(["projects"]);
    expect(resolvePath(["projects"], "edf")).toEqual(["projects", "edf"]);
  });

  it(".. remonte d'un niveau", () => {
    expect(resolvePath(["projects"], "..")).toEqual([]);
    expect(resolvePath(["projects", "edf"], "..")).toEqual(["projects"]);
  });

  it(".. au-delà de la racine reste à la racine", () => {
    expect(resolvePath([], "..")).toEqual([]);
    expect(resolvePath(["projects"], "../../..")).toEqual([]);
  });

  it(". reste sur place", () => {
    expect(resolvePath(["projects"], ".")).toEqual(["projects"]);
  });

  it("chemin absolu avec ~/", () => {
    expect(resolvePath(["projects"], "~/about")).toEqual(["about"]);
    expect(resolvePath(["projects"], "~/about/curriculum_vitae.html")).toEqual([
      "about",
      "curriculum_vitae.html",
    ]);
  });

  it("chemin absolu avec /", () => {
    expect(resolvePath(["projects"], "/about")).toEqual(["about"]);
  });

  it("chemin relatif composé", () => {
    expect(resolvePath(["projects"], "../about")).toEqual(["about"]);
    expect(resolvePath(["projects", "edf"], "../../about")).toEqual(["about"]);
  });

  it("retourne null pour un chemin inexistant", () => {
    expect(resolvePath([], "xyz")).toBeNull();
    expect(resolvePath(["projects"], "../xyz")).toBeNull();
  });
});

describe("findByName", () => {
  it("trouve un fichier n'importe où dans l'arbre", () => {
    const node = findByName("curriculum_vitae.html");
    expect(node?.kind).toBe("file");
    expect(node?.name).toBe("curriculum_vitae.html");
  });

  it("trouve un projet par slug", () => {
    const node = findByName("edf");
    expect(node?.kind).toBe("file");
    expect(node?.effect).toMatchObject({ kind: "openProject", slug: "edf" });
  });

  it("retourne null pour un nom inconnu", () => {
    expect(findByName("xyz")).toBeNull();
  });

  it("retourne null pour une chaîne vide", () => {
    expect(findByName("")).toBeNull();
  });
});

describe("INITIAL_CWD", () => {
  it("est ~/projects par défaut", () => {
    expect(INITIAL_CWD).toEqual(["projects"]);
  });
});

describe(".secrets (dossier caché)", () => {
  it(".secrets est un dossier avec flag hidden", () => {
    const node = findNode([".secrets"]);
    expect(node?.kind).toBe("dir");
    expect(node?.hidden).toBe(true);
  });

  it("note.txt accessible via findNode", () => {
    const node = findNode([".secrets", "note.txt"]);
    expect(node?.kind).toBe("file");
    if (node?.kind === "file") {
      expect(node.content).toBeDefined();
      expect(node.content?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("easter.txt accessible via resolvePath depuis ~", () => {
    const resolved = resolvePath([], "~/.secrets/easter.txt");
    expect(resolved).toEqual([".secrets", "easter.txt"]);
  });
});
