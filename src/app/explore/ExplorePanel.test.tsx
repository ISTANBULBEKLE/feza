import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ExplorePanel } from "./ExplorePanel";
import type { NasaSearchItem } from "@/lib/nasa";

const sampleItems: NasaSearchItem[] = [
  {
    nasaId: "a",
    title: "Curiosity at Glen Etive",
    description: "",
    center: "JPL",
    dateCreated: "2019-10-04",
    mediaType: "image",
    thumbnail: "https://example.com/a.jpg",
    detailHref: "x",
  },
];

describe("ExplorePanel", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ items: sampleItems, totalHits: 42 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all four selects with default topic preselected", () => {
    render(<ExplorePanel />);
    expect(screen.getByLabelText("Topic")).toHaveValue("mars rover");
    expect(screen.getByLabelText("Media type")).toBeInTheDocument();
    expect(screen.getByLabelText("Year from")).toBeInTheDocument();
    expect(screen.getByLabelText("Year to")).toBeInTheDocument();
  });

  it("fetches results and renders cards after debounce", async () => {
    render(<ExplorePanel />);
    await waitFor(
      () => expect(screen.getByText(/Curiosity at Glen Etive/)).toBeInTheDocument(),
      { timeout: 1500 },
    );
    expect(screen.getByText(/1 of 42 results/)).toBeInTheDocument();
  });
});
