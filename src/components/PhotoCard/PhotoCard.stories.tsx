import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhotoCard } from "./PhotoCard";
import type { NasaSearchItem } from "@/lib/nasa";

const baseItem: NasaSearchItem = {
  nasaId: "PIA12235",
  title: "Saturn's Rings in Approaching Northern Light",
  description: "Cassini approaches Saturn during its Solstice mission.",
  center: "JPL",
  dateCreated: "2010-08-04T00:00:00Z",
  mediaType: "image",
  thumbnail: "https://images-assets.nasa.gov/image/PIA12235/PIA12235~thumb.jpg",
  detailHref: "https://images-api.nasa.gov/asset/PIA12235",
};

const meta = {
  title: "components/PhotoCard",
  component: PhotoCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithThumbnail: Story = {
  args: { item: baseItem },
};

export const NoThumbnail: Story = {
  args: { item: { ...baseItem, thumbnail: undefined } },
};

export const VideoFallback: Story = {
  args: { item: { ...baseItem, thumbnail: undefined, mediaType: "video" } },
};
