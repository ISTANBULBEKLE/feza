import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the project tag and current year", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText(/NASA explorer demo/)).toBeInTheDocument();
    expect(screen.getByText(`© ${new Date().getFullYear()}`)).toBeInTheDocument();
  });

  it("links to NASA resources in new tabs", () => {
    render(<Footer />);
    const nasaLink = screen.getByRole("link", { name: /NASA Image Library/ });
    expect(nasaLink).toHaveAttribute("href", "https://images.nasa.gov/");
    expect(nasaLink).toHaveAttribute("target", "_blank");
    expect(nasaLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
