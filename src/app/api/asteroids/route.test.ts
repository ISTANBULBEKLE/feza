import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/asteroids (placeholder)", () => {
  it("returns 501 with the not-implemented error body", async () => {
    const response = await GET();

    expect(response.status).toBe(501);

    const body = (await response.json()) as { error: string };
    expect(body.error).toMatch(/not implemented/i);
    expect(body.error).toMatch(/EPICS_E3\.md/);
  });

  it("returns JSON content type", async () => {
    const response = await GET();
    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
