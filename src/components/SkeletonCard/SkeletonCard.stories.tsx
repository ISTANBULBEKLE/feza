import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkeletonCard } from "./SkeletonCard";

const meta = {
  title: "components/SkeletonCard",
  component: SkeletonCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { count: 1 },
};

export const Grid: Story = {
  args: { count: 4 },
};
