import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileIcon } from "@/components/ui/FileIcon";

describe("FileIcon", () => {
  it("rend un button avec le label visible et data-kind", () => {
    render(<FileIcon kind="folder" label="EDF" />);
    const btn = screen.getByRole("button", { name: "EDF" });
    expect(btn.getAttribute("data-kind")).toBe("folder");
  });

  it("single click déclenche onClick (sélection)", () => {
    const onClick = vi.fn();
    render(<FileIcon kind="folder" label="EDF" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "EDF" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("double click déclenche onDoubleClick (ouverture)", () => {
    const onDoubleClick = vi.fn();
    render(<FileIcon kind="folder" label="EDF" onDoubleClick={onDoubleClick} />);
    fireEvent.doubleClick(screen.getByRole("button", { name: "EDF" }));
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });

  it("expose data-selected et aria-pressed quand selected=true", () => {
    render(<FileIcon kind="folder" label="EDF" selected />);
    const btn = screen.getByRole("button", { name: "EDF" });
    expect(btn.getAttribute("data-selected")).toBe("true");
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("kind=folder + selected=true bascule sur le glyphe folder-selected", () => {
    render(<FileIcon kind="folder" label="EDF" selected />);
    const svg = screen.getByRole("button", { name: "EDF" }).querySelector("svg");
    expect(svg?.getAttribute("data-icon-kind")).toBe("folder-selected");
  });

  it("kind=document + selected=true reste sur le glyphe document (pas d'inversion folder)", () => {
    render(<FileIcon kind="document" label="cv.html" selected />);
    const svg = screen.getByRole("button", { name: "cv.html" }).querySelector("svg");
    expect(svg?.getAttribute("data-icon-kind")).toBe("document");
  });

  it("ariaLabel surcharge l'aria-label par défaut", () => {
    render(<FileIcon kind="hd" label="HD" ariaLabel="Macintosh HD — disque dur" />);
    expect(screen.getByRole("button", { name: "Macintosh HD — disque dur" })).toBeInTheDocument();
  });
});
