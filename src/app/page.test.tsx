import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page (landing)", () => {
  it("renders the hero with the .fz-shine gilded heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /Explore the universe with NASA \+ Claude Code/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toMatch(/fz-shine/);
  });

  it("links to all three epic routes", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /Epic 1[\s\S]*Explore NASA Image Library/i }))
      .toHaveAttribute("href", "/explore");
    expect(screen.getByRole("link", { name: /Epic 2[\s\S]*Astronomy Picture of the Day/i }))
      .toHaveAttribute("href", "/apod");
    expect(screen.getByRole("link", { name: /Epic 3[\s\S]*Near-Earth Objects/i }))
      .toHaveAttribute("href", "/asteroids");
  });

  it("renders the eyebrow tag", () => {
    render(<Home />);
    expect(screen.getByText(/feza · live demo app/i)).toBeInTheDocument();
  });

  it("describes Part 1 vs Part 2 in the epic card tags", () => {
    render(<Home />);
    expect(screen.getByText(/Epic 2 · live-coded · Part 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Epic 3 · live-coded · Part 2/i)).toBeInTheDocument();
  });
});
