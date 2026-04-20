import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "@/components/ui/Tag";

describe("Tag", () => {
  it("rend un span contenant le label", () => {
    render(<Tag>Design</Tag>);
    const tag = screen.getByText("Design");
    expect(tag.tagName).toBe("SPAN");
    expect(tag.className).toMatch(/tag/);
  });

  it("fusionne une className externe", () => {
    render(<Tag className="custom">Design</Tag>);
    expect(screen.getByText("Design")).toHaveClass("custom");
  });
});
