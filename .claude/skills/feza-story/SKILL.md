---
name: feza-story
description: Scaffold a Storybook CSF3 stories file alongside an existing feza component at src/components/<Name>/<Name>.stories.tsx. Use when the user asks to "add stories", "create a Storybook story for X", or names a component to add stories for.
arguments: [Name]
---

Scaffold a stories file for component `$Name`.

Verify `src/components/$Name/$Name.tsx` is present. If not, stop and tell the user to scaffold it first with `/feza-component $Name`. Verify `.storybook/main.ts` is present; if not, stop and tell the user to run `npx storybook@latest init --type nextjs` once.

Read `src/components/$Name/$Name.tsx` and pick out the exported `${Name}Props`. Use what you find to choose sensible `args` for the stories. **If the props include a `variant` union (e.g. `"primary" | "ghost"`), emit one named story per variant** (`Primary`, `Ghost`, …). Otherwise emit `Default` plus one variant story (`WithClassName`, or — if the domain suggests it — `Loading` / `Empty` / `Error` / `WithImage`). If `${Name}Props` includes `children: ReactNode`, set `args.children` to a short literal string.

Write `src/components/$Name/$Name.stories.tsx`:

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

Verify with `npm run build-storybook -- --quiet --output-dir .storybook-out`. If it fails, fix the failure before reporting completion. `.storybook-out/` is gitignored — do not commit it.

Do NOT import the component's SCSS module into the stories file — Storybook picks up `*.module.scss` via the existing config. Do NOT add stories to a flat `src/stories/` folder — feza colocates `<Name>.stories.tsx` inside `src/components/<Name>/`.
