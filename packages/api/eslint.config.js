import { config as baseConfig } from "@repo/eslint-config/base";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: [".wrangler/**", "dist/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
];
