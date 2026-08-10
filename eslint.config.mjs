import openmrs from "@openmrs/eslint-config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  { ignores: ["dist/**", "coverage/**"] },
  ...openmrs,
  // Accessibility rules this repo got from eslint-config-ts-react-important-stuff,
  // which is eslintrc-only. Taken from the plugin directly instead.
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // Rules this repo enforces where the shared config does not.
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "no-extra-boolean-cast": "error",
      "no-prototype-builtins": "error",
      "no-unsafe-optional-chaining": "error",
      "no-useless-escape": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      // Also from ts-react-important-stuff.
      "no-duplicate-imports": "error",
      "no-extra-bind": "error",
      "no-implied-eval": "error",
      "no-labels": "error",
      "no-self-compare": "error",
      "no-throw-literal": "error",
      "no-void": "error",
      "react-hooks/exhaustive-deps": "warn",
      // typescript-eslint v5 had these in its recommended set. v6 moved them to
      // stylistic, so they are pinned here rather than quietly dropped.
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      // eslint-config-ts-react-important-stuff turned this off, so it stays off.
      "jsx-a11y/no-autofocus": "off",
    },
  },
  // This repo's prettier script only writes, so lint is the formatting gate.
  prettierRecommended,
];
