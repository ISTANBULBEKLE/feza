import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

const pathnameMock = vi.fn<() => string>(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("Header", () => {
  it("renders brand and nav links", () => {
    pathnameMock.mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByLabelText(/feza · home/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
    expect(screen.getByRole("link", { name: "APOD" })).toHaveAttribute("href", "/apod");
  });

  it("marks the active link via aria-current=page", () => {
    pathnameMock.mockReturnValue("/explore");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "APOD" })).not.toHaveAttribute("aria-current");
  });

  it("treats nested routes as active (e.g. /explore/anything)", () => {
    pathnameMock.mockReturnValue("/explore/details");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("aria-current", "page");
  });
});
