import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhotoGrid } from "./PhotoGrid";
import type { NasaSearchItem } from "@/lib/nasa";

const items: NasaSearchItem[] = [
  {
    nasaId: "a",
    title: "Alpha",
    description: "",
    center: "JPL",
    dateCreated: "2020-01-01",
    mediaType: "image",
    thumbnail: "https://x/y.jpg",
    detailHref: "x",
  },
  {
    nasaId: "b",
    title: "Beta",
    description: "",
    center: "GSFC",
    dateCreated: "2021-01-01",
    mediaType: "image",
    thumbnail: "https://x/z.jpg",
    detailHref: "x",
  },
];

describe("PhotoGrid", () => {
  it("shows empty message when no items", () => {
    render(<PhotoGrid items={[]} emptyMessage="Nothing here." />);
    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
  });

  it("renders one listitem per item", () => {
    render(<PhotoGrid items={items} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
  });
});
