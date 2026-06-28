import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(

  // Ignore generated files
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**"
    ]
  },

  // JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Project-specific settings
  {
    files: ["**/*.ts"],

    languageOptions: {
      globals: {
        ...globals.node
      }
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },

  // Jest tests
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],

    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
);