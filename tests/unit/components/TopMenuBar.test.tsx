import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopMenuBar } from "@/components/os/OSBar/TopMenuBar";

const mockCloseWindow = vi.fn();
vi.mock("@/stores/windowStore", () => ({
  selectFocusedId: (s: { focusedId: string | null }) => s.focusedId,
  useWindowStore: (
    selector: (s: { focusedId: string | null; closeWindow: ReturnType<typeof vi.fn> }) => unknown,
  ) => selector({ focusedId: "main", closeWindow: mockCloseWindow }),
}));

describe("TopMenuBar", () => {
  afterEach(() => {
    mockCloseWindow.mockClear();
  });

  it("affiche les triggers File, Edit, View", () => {
    const { getByText } = render(<TopMenuBar onQuit={vi.fn()} />);
    expect(getByText("File")).toBeInTheDocument();
    expect(getByText("Edit")).toBeInTheDocument();
    expect(getByText("View")).toBeInTheDocument();
  });

  it("ouvre le sous-menu File au clic", () => {
    const { getByText, queryByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    expect(queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(getByText("File"));
    expect(queryByRole("menu")).toBeInTheDocument();
  });

  it("File > Quit appelle onQuit", () => {
    const onQuit = vi.fn();
    const { getByText, getByRole } = render(<TopMenuBar onQuit={onQuit} />);
    fireEvent.click(getByText("File"));
    fireEvent.click(getByRole("menuitem", { name: /Quit/i }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it("File > Close appelle closeWindow sur la fenêtre focused", () => {
    const { getByText, getByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    fireEvent.click(getByText("File"));
    fireEvent.click(getByRole("menuitem", { name: /Close/i }));
    expect(mockCloseWindow).toHaveBeenCalledWith("main");
  });

  it("File > Open est désactivé si onOpenFinder n'est pas fourni", () => {
    const { getByText, getByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    fireEvent.click(getByText("File"));
    expect(getByRole("menuitem", { name: /Open/i })).toBeDisabled();
  });

  it("File > Open appelle onOpenFinder quand fourni", () => {
    const onOpenFinder = vi.fn();
    const { getByText, getByRole } = render(
      <TopMenuBar onQuit={vi.fn()} onOpenFinder={onOpenFinder} />,
    );
    fireEvent.click(getByText("File"));
    fireEvent.click(getByRole("menuitem", { name: /Open/i }));
    expect(onOpenFinder).toHaveBeenCalledTimes(1);
  });

  it("Edit expose des items disabled (Undo/Cut/Copy/Paste)", () => {
    const { getByText, getByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    fireEvent.click(getByText("Edit"));
    expect(getByRole("menuitem", { name: /Undo/i })).toBeDisabled();
    expect(getByRole("menuitem", { name: /Cut/i })).toBeDisabled();
    expect(getByRole("menuitem", { name: /Copy/i })).toBeDisabled();
    expect(getByRole("menuitem", { name: /Paste/i })).toBeDisabled();
  });

  it("View expose des items disabled", () => {
    const { getByText, getByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    fireEvent.click(getByText("View"));
    expect(getByRole("menuitem", { name: /By Icon/i })).toBeDisabled();
  });

  it("ferme le menu sur clic extérieur", () => {
    const { getByText, queryByRole } = render(<TopMenuBar onQuit={vi.fn()} />);
    fireEvent.click(getByText("File"));
    expect(queryByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});
