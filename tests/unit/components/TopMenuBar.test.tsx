import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopMenuBar } from "@/components/os/OSBar/TopMenuBar";

// Mock useWindowStore
const mockOpenWindow = vi.fn();
vi.mock("@/stores/windowStore", () => ({
  useWindowStore: (selector: (s: { openWindow: ReturnType<typeof vi.fn> }) => unknown) =>
    selector({ openWindow: mockOpenWindow }),
}));

describe("TopMenuBar", () => {
  const defaultProps = {
    setTheme: vi.fn(),
    currentTheme: "dark" as const,
  };

  afterEach(() => {
    mockOpenWindow.mockClear();
  });

  it("affiche les items Fichier, Édition, Vue, Aide", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    expect(getByText("Fichier")).toBeInTheDocument();
    expect(getByText("Édition")).toBeInTheDocument();
    expect(getByText("Vue")).toBeInTheDocument();
    expect(getByText("Aide")).toBeInTheDocument();
  });

  it("ouvre le sous-menu Fichier au clic", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("clique sur 'Accueil' dans Fichier appelle openWindow avec id 'main'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Accueil"));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "main" }));
  });

  it("clique sur 'Terminal' dans Fichier appelle openWindow avec id 'terminal'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText("Terminal"));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "terminal" }));
  });

  it("clique sur 'CV' dans Fichier appelle openWindow avec id 'cv'", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    fireEvent.click(getByText(/CV/i));
    expect(mockOpenWindow).toHaveBeenCalledWith(expect.objectContaining({ id: "cv" }));
  });

  it("'Édition' est aria-disabled", () => {
    const { getByText } = render(<TopMenuBar {...defaultProps} />);
    expect(getByText("Édition").closest("button")).toHaveAttribute("aria-disabled", "true");
  });

  it("clique sur 'Édition' n'ouvre pas de menu", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Édition"));
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("ouvre le sous-menu Vue et clique Thème Clair appelle setTheme('light')", () => {
    const setTheme = vi.fn();
    const { getByText } = render(<TopMenuBar setTheme={setTheme} currentTheme="dark" />);
    fireEvent.click(getByText("Vue"));
    fireEvent.click(getByText(/Thème Clair/i));
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByText, queryByRole } = render(<TopMenuBar {...defaultProps} />);
    fireEvent.click(getByText("Fichier"));
    expect(queryByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
