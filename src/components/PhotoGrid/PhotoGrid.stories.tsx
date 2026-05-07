import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhotoGrid } from "./PhotoGrid";
import type { NasaSearchItem } from "@/lib/nasa";

const item = (n: number): NasaSearchItem => ({
  nasaId: `PIA${10000 + n}`,
  title: `Sample image ${n}`,
  description: `Sample description ${n}`,
  center: "JPL",
  dateCreated: "2024-01-01T00:00:00Z",
  mediaType: "image",
  thumbnail: `https://images-assets.nasa.gov/image/PIA${10000 + n}/PIA${10000 + n}~thumb.jpg`,
  detailHref: `https://images-api.nasa.gov/asset/PIA${10000 + n}`,
});

const meta = {
  title: "components/PhotoGrid",
  component: PhotoGrid,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourItems: Story = {
  args: { items: [item(1), item(2), item(3), item(4)] },
};

export const Empty: Story = {
  args: { items: [], emptyMessage: "Try a different search." },
};
