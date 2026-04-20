import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectFrontmatter } from "@/content/projects.types";

const edfFrontmatter: ProjectFrontmatter = {
  title: "Design System EDF",
  subtitle: "Architecture de tokens",
  tags: ["Design System", "Tokens"],
  coverImages: [],
  order: 1,
};

function StubComponent() {
  return <p data-testid="mdx-body">Contenu EDF</p>;
}

vi.mock("@/content/projects.mdx", () => ({
  getProjectMdx: (slug: string) => {
    if (slug === "edf") {
      return { Component: StubComponent, frontmatter: edfFrontmatter };
    }
    return undefined;
  },
}));

const { ProjectWindow } = await import("@/components/windows/ProjectWindow");
const { projectWindowId } = await import("@/content/projects.config");
const { useWindowStore } = await import("@/stores/windowStore");

function resetStore() {
  useWindowStore.setState({ windows: {}, order: [] });
}

describe("ProjectWindow", () => {
  beforeEach(() => {
    resetStore();
    window.sessionStorage.clear();
  });

  it("ne rend rien pour un slug inconnu", () => {
    const { container } = render(<ProjectWindow slug="inexistant" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ne rend rien quand la fenêtre n'est pas ouverte", () => {
    render(<ProjectWindow slug="edf" />);
    expect(screen.queryByText(edfFrontmatter.title)).not.toBeInTheDocument();
  });

  it("rend le frontmatter et le composant MDX quand la fenêtre est ouverte", () => {
    useWindowStore
      .getState()
      .openWindow({ id: projectWindowId("edf"), type: "project", title: "edf.md" });
    render(<ProjectWindow slug="edf" />);

    expect(
      screen.getByRole("heading", { level: 1, name: edfFrontmatter.title }),
    ).toBeInTheDocument();
    if (edfFrontmatter.subtitle) {
      expect(screen.getByText(edfFrontmatter.subtitle)).toBeInTheDocument();
    }
    for (const tag of edfFrontmatter.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    expect(screen.getByTestId("mdx-body")).toBeInTheDocument();
  });
});
