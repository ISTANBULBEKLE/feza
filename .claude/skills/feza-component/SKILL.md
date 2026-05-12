---
name: feza-component
description: Scaffold a feza component (three files — .tsx + .module.scss + .test.tsx) following the project's conventions in src/components/<Name>/. Use whenever the user asks to "create a component", "scaffold X component", or names a component to add.
arguments: [Name]
---

Scaffold a component named `$Name` under `src/components/$Name/`.

Create exactly these three files using the Write tool. Use `$Name` literally — do not lowercase or transform it.

## File 1: `src/components/$Name/$Name.tsx`

```tsx
import styles from "./$Name.module.scss";
import { cx } from "@/helpers/classNames";

export interface $NameProps {
  className?: string;
  children?: React.ReactNode;
}

export function $Name({ className, children }: $NameProps) {
  return (
    <div className={cx(styles.root, className)}>
      {children}
    </div>
  );
}
```

If the component clearly needs hooks or event handlers, prepend `"use client";` to the file. Otherwise, leave it as a server component.

## File 2: `src/components/$Name/$Name.module.scss`

```scss
.root {
  display: block;
}
```

## File 3: `src/components/$Name/$Name.test.tsx`

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { $Name } from "./$Name";

describe("$Name", () => {
  it("renders children", () => {
    render(<$Name>hello</$Name>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
```

After writing all three files, run `npm run test -- $Name` to verify the test passes. If it does not, fix the failure before reporting completion.

Do NOT add the component to any index file — components are imported by their full path in feza.
