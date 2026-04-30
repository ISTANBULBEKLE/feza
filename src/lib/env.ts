// Server-only env accessors. Throws loud errors instead of silently falling
// back to DEMO_KEY (which has a 30 req/hr cap that would brick a live demo).

import "server-only";

export function nasaApiKey(): string {
  const key = process.env.NASA_API_KEY;
  if (!key) {
    throw new Error(
      "NASA_API_KEY is not set. Register a free key at https://api.nasa.gov/ and add it to .env.local",
    );
  }
  return key;
}
