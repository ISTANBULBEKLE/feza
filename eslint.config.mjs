import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // feza-specific:
    ".claude/**",          // agent skills + ephemeral worktree shadow trees
    ".trunk/**",           // trunk-io configs
    "coverage/**",         // vitest LCOV output (consumed by Sonar)
    "storybook-static/**", // chromatic-built Storybook
    ".storybook-out/**",   // /feza-story skill verification build
    "design-handoff/**",   // exported design contract (reference snippets, not app code)
  ]),
]);

export default eslintConfig;
