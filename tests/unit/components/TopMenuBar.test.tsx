import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopMenuBar } from "@/components/os/OSBar/TopMenuBar";

const mockOpenWindow = vi.fn();
vi.mock("@/stores/windowStore", () => ({
  useWindowStore: (selector: (s: { openWindow: ReturnType<typeof vi.fn> }) => unknown) =>
    selector({ openWindow: mockOpenWindow }),
}));

describe("TopMenuBar", () => {
  afterEach(() => {
    mockOpenWindow.mockClear();
  });

  it("affiche les items Fichier, Édition, Vue, Aide", () => {
    const { getByText } = render(<TopMenuBar />);
    expect(getByText("Fichier")).toBeInTheDocument();
    expect(getByText("Édition")).toBeInTheDocument();
    expect(getByText("Vue")).toBeInTheDocument();
    expect(getByText("Aide")).toBeInTheDocument();
  });

  it("ouvre le sous-menu Fichier au clic", () => {
    const { getByText, queryByRole } = render(<TopMenuBar />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("clique sur 'Accueil' dans Fichier appelle openWindow avec id 'main'", () => {
    const { getByText } = render(<TopMenuBar />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Accueil"));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "main" }));
  });

  it("clique sur 'Terminal' dans Fichier appelle openWindow avec id 'terminal'", () => {
    const { getByText } = render(<TopMenuBar />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Terminal"));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "terminal" }));
  });

  it("clique sur 'CV' dans Fichier appelle openWindow avec id 'cv'", () => {
    const { getByText } = render(<TopMenuBar />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText(/CV/i));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "cv" }));
  });

  it("clique sur 'Édition' ouvre un dropdown 'Bientôt disponible'", () => {
    const { getByText, getByRole } = render(<TopMenuBar />);
    fireEvent.click(getByText("Édition"));
    expect(getByRole("menu")).toBeInTheDocument();
    expect(getByText("Bientôt disponible")).toBeInTheDocument();
  });

  it("clique sur 'Vue' ouvre un dropdown 'Bientôt disponible'", () => {
    const { getByText, getByRole, getAllByText } = render(<TopMenuBar />);
    fireEvent.click(getByText("Vue"));
    expect(getByRole("menu")).toBeInTheDocument();
    expect(getAllByText("Bientôt disponible").length).toBeGreaterThan(0);
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByText, queryByRole } = render(<TopMenuBar />);
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
