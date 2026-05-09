import { describe, expect, it } from "vitest";
import { getAsteroids, type GetAsteroidsParams } from "./nasa";

describe("getAsteroids (Epic 3 placeholder)", () => {
  // The function is intentionally a stub until Part 2 lives KAN-6.
  // These tests lock that contract: the placeholder must throw, with a
  // recognisable message, so accidental shipping of an empty body is caught
  // by CI rather than discovered live on stage.
  const params: GetAsteroidsParams = {
    apiKey: "test-key",
    startDate: "2026-05-10",
  };

  it("rejects with a not-implemented error", async () => {
    await expect(getAsteroids(params)).rejects.toThrow(/not implemented/i);
  });

  it("references the Part 2 ticket (KAN-6 / E3-T2) in the error message", async () => {
    await expect(getAsteroids(params)).rejects.toThrow(/E3-T2|Part 2/);
  });
});
