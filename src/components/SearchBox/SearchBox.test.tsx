import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("renders label, value, and placeholder", () => {
    render(
      <SearchBox
        id="q"
        label="Search"
        value="mars"
        onChange={() => {}}
        placeholder="Type a topic"
      />,
    );
    expect(screen.getByLabelText(/Search/)).toHaveValue("mars");
    expect(screen.getByPlaceholderText("Type a topic")).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBox id="q" label="Search" value="" onChange={onChange} />);
    // Note: input is controlled; with a fixed value="", React resets after each
    // keystroke, so each call gets a single character. We just verify wiring.
    await user.type(screen.getByLabelText(/Search/), "hubble");
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange).toHaveBeenNthCalledWith(1, "h");
  });

  it("shows a clear button when value is non-empty and clears via onChange('')", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBox id="q" label="Search" value="apollo" onChange={onChange} />);
    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("hides the clear button when value is empty", () => {
    render(<SearchBox id="q" label="Search" value="" onChange={() => {}} />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });
});
