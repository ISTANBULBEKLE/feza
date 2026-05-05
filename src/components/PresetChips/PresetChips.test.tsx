import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PresetChips } from "./PresetChips";

const presets = [
  { label: "Mars", value: "mars" },
  { label: "Hubble", value: "hubble" },
];

describe("PresetChips", () => {
  it("renders one chip per preset", () => {
    render(<PresetChips presets={presets} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Mars" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hubble" })).toBeInTheDocument();
  });

  it("marks the active chip with aria-pressed", () => {
    render(<PresetChips presets={presets} active="hubble" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Hubble" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Mars" })).toHaveAttribute("aria-pressed", "false");
  });

  it("invokes onSelect with the chip value", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PresetChips presets={presets} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Mars" }));
    expect(onSelect).toHaveBeenCalledWith("mars");
  });
});
