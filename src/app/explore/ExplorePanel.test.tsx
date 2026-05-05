import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExplorePanel } from "./ExplorePanel";
import type { NasaSearchItem } from "@/lib/nasa";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/explore",
  useSearchParams: () => new URLSearchParams(),
}));

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
    replaceMock.mockClear();
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

  it("renders search input, preset chips, and the secondary selects", () => {
    render(<ExplorePanel />);
    expect(screen.getByLabelText(/Search NASA images/)).toHaveValue("mars rover");
    expect(screen.getByRole("button", { name: "Mars Rover" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
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

  it("clicking a preset chip updates the search input", async () => {
    const user = userEvent.setup();
    render(<ExplorePanel />);
    await user.click(screen.getByRole("button", { name: "Hubble" }));
    expect(screen.getByLabelText(/Search NASA images/)).toHaveValue("hubble");
  });

  it("syncs filter changes into the URL via router.replace", async () => {
    const user = userEvent.setup();
    render(<ExplorePanel />);
    await user.click(screen.getByRole("button", { name: "James Webb (JWST)" }));
    await waitFor(() => expect(replaceMock).toHaveBeenCalled());
    const lastCall = replaceMock.mock.calls.at(-1);
    expect(lastCall?.[0]).toMatch(/q=james\+webb/);
  });

  it("shows an inline error and skips fetching when year range is invalid", async () => {
    render(<ExplorePanel initial={{ q: "hubble", yearStart: "2020", yearEnd: "1999" }} />);
    expect(screen.getByText(/Year from must be ≤ year to/)).toBeInTheDocument();
    // Wait past debounce; fetch should not have been called.
    await new Promise((r) => setTimeout(r, 500));
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
