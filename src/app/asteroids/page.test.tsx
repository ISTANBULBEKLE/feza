import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AsteroidsPage from "./page";

describe("AsteroidsPage (placeholder)", () => {
  it("renders the Epic 3 eyebrow tag", () => {
    render(<AsteroidsPage />);
    expect(
      screen.getByText(/Epic 3 · Part 2 live demo target/i),
    ).toBeInTheDocument();
  });

  it("renders the Near-Earth Objects heading with .fz-shine", () => {
    render(<AsteroidsPage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /Near-Earth Objects/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toMatch(/fz-shine/);
  });

  it("renders all five demo steps in order", () => {
    render(<AsteroidsPage />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items[0]).toHaveTextContent(/atlassian:search-company-knowledge KAN-2/);
    expect(items[1]).toHaveTextContent(/claude\.ai\/design/);
    expect(items[2]).toHaveTextContent(/feza-from-jira KAN-8/);
    expect(items[3]).toHaveTextContent(/feza-from-jira KAN-7/);
    expect(items[4]).toHaveTextContent(/feza-from-jira KAN-6/);
  });
});
