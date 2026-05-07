import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBox } from "./SearchBox";

const meta = {
  title: "components/SearchBox",
  component: SearchBox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    id: "search-empty",
    label: "Search NASA images",
    value: "",
    placeholder: "Try 'Apollo 11'",
  },
};

export const WithValue: Story = {
  args: {
    id: "search-filled",
    label: "Search NASA images",
    value: "James Webb",
    placeholder: "Try 'Apollo 11'",
  },
};
