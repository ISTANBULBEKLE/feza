import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

describe("Select", () => {
  it("renders label, placeholder, and options", () => {
    render(
      <Select
        id="rover"
        label="Rover"
        value=""
        placeholder="Pick one"
        options={[
          { label: "Curiosity", value: "curiosity" },
          { label: "Perseverance", value: "perseverance" },
        ]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Rover")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pick one" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Curiosity" })).toBeInTheDocument();
  });

  it("emits onChange with the selected value", async () => {
    const onChange = vi.fn();
    render(
      <Select
        id="media"
        label="Media"
        value=""
        options={[
          { label: "Image", value: "image" },
          { label: "Video", value: "video" },
        ]}
        onChange={onChange}
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText("Media"), "video");
    expect(onChange).toHaveBeenCalledWith("video");
  });
});
