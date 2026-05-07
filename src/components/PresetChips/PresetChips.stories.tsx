import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PresetChips } from "./PresetChips";

const presets = [
  { label: "Apollo Missions", value: "apollo" },
  { label: "Hubble", value: "hubble" },
  { label: "James Webb (JWST)", value: "james webb" },
  { label: "ISS", value: "international space station" },
] as const;

const meta = {
  title: "components/PresetChips",
  component: PresetChips,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    presets,
    onSelect: () => {},
  },
} satisfies Meta<typeof PresetChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HubbleActive: Story = {
  args: { active: "hubble" },
};
