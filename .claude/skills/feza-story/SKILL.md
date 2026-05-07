---
name: feza-story
description: Scaffold a Storybook 8-style CSF3 stories file alongside an existing feza component at src/components/<Name>/<Name>.stories.tsx. Use when the user asks to "add stories", "create a Storybook story for X", or names a component to add stories for.
arguments: [Name]
---

Scaffold a stories file for component `$Name`.

## Step 1 — Verify the component exists

Confirm `src/components/$Name/$Name.tsx` is present. If it isn't, stop and tell the user to scaffold it first with `/feza-component $Name`.

Confirm `.storybook/main.ts` is present. If it isn't, stop and tell the user to run `npx storybook@latest init --type nextjs` once before adding stories.

## Step 2 — Read the component's prop shape

Read `src/components/$Name/$Name.tsx` and pick out the exported `${Name}Props` interface. Use what you find to choose sensible `args` for the `Default` story. If the component takes a `variant` union (e.g. `"primary" | "ghost"`), map each variant to its own story. Otherwise add a single `WithClassName` variant alongside `Default`.

## Step 3 — Write `src/components/$Name/$Name.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { $Name } from "./$Name";

const meta = {
  title: "components/$Name",
  component: $Name,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof $Name>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // TODO: fill from ${Name}Props
  },
};
```

If `${Name}Props` includes `children: ReactNode`, set `args.children` to a short literal string. If it includes a `variant` union, emit one named story per variant (e.g. `Primary`, `Ghost`) instead of `Default` + `WithClassName`.

## Step 4 — Verify

Run `npm run build-storybook -- --quiet --output-dir .storybook-out`. If it fails, fix the failure before reporting completion. Do NOT commit `.storybook-out/` — it's an ephemeral build artifact.

Do NOT import the component's SCSS module into the stories file — Storybook picks up `*.module.scss` via the existing config. Do NOT add stories to a flat `src/stories/` folder — feza colocates `<Name>.stories.tsx` inside `src/components/<Name>/`, next to the `.tsx` and `.test.tsx`.
