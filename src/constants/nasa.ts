export const IMAGE_LIBRARY_BASE = "https://images-api.nasa.gov";
export const APOD_BASE = "https://api.nasa.gov/planetary/apod";

/** Public NASA detail page for an asset (clickable from a PhotoCard). */
export const nasaDetailUrl = (nasaId: string): string =>
  `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`;

export const TOPIC_PRESETS = [
  { label: "Mars Rover", value: "mars rover" },
  { label: "Apollo Missions", value: "apollo" },
  { label: "Hubble", value: "hubble" },
  { label: "James Webb (JWST)", value: "james webb" },
  { label: "ISS", value: "international space station" },
  { label: "Earth from Orbit", value: "earth from orbit" },
] as const;

export type TopicPresetValue = (typeof TOPIC_PRESETS)[number]["value"];

export const MEDIA_TYPES = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
] as const;

export type MediaType = (typeof MEDIA_TYPES)[number]["value"];

const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1958 + 1 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { label: String(y), value: String(y) };
});
