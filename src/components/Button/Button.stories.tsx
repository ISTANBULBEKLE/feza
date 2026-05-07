import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Search",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Cancel",
  },
};
