import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AboutDialog } from "@/components/ui/Dialog/AboutDialog";

describe("AboutDialog", () => {
  it("ne rend rien quand open=false", () => {
    const { container } = render(<AboutDialog open={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("rend le titre About this Macintosh + nom + bouton OK", () => {
    render(<AboutDialog open onClose={vi.fn()} />);
    expect(screen.getByRole("alertdialog", { name: /About this Macintosh/i })).toBeInTheDocument();
    expect(screen.getByText(/Samuel Boulery/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("OK appelle onClose", () => {
    const onClose = vi.fn();
    render(<AboutDialog open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
