import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkeletonCard } from "./SkeletonCard";

describe("SkeletonCard", () => {
  it("renders a single skeleton by default", () => {
    render(<SkeletonCard />);
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(1);
  });

  it("renders the requested number of skeletons", () => {
    render(<SkeletonCard count={6} />);
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });
});
