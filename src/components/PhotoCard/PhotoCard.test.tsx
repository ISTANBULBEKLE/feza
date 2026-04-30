import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhotoCard } from "./PhotoCard";
import type { NasaSearchItem } from "@/lib/nasa";

const sample: NasaSearchItem = {
  nasaId: "PIA12345",
  title: "Curiosity self-portrait",
  description: "Mars rover Curiosity's view at the Glen Etive site.",
  center: "JPL",
  dateCreated: "2019-10-04T00:00:00Z",
  mediaType: "image",
  thumbnail: "https://example.com/preview.jpg",
  detailHref: "https://example.com/collection.json",
};

describe("PhotoCard", () => {
  it("renders title, meta, description, and image", () => {
    render(<PhotoCard item={sample} />);
    expect(screen.getByRole("heading", { name: /Curiosity self-portrait/ })).toBeInTheDocument();
    expect(screen.getByText("JPL")).toBeInTheDocument();
    expect(screen.getByText(/Glen Etive/)).toBeInTheDocument();
    const img = screen.getByAltText("Curiosity self-portrait") as HTMLImageElement;
    expect(img.src).toBe("https://example.com/preview.jpg");
  });

  it("falls back when there is no thumbnail", () => {
    const noThumb = { ...sample, thumbnail: undefined };
    render(<PhotoCard item={noThumb} />);
    expect(screen.getByText("IMAGE")).toBeInTheDocument();
  });
});
