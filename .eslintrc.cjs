module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "testing-library"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double", { avoidEscape: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-inferrable-types": ["warn", { ignoreParameters: true }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^(_|self$)", varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-empty-function": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
  },
  overrides: [
    {
      files: ["src/tests/**/*.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "build/",
    "dist/",
    "coverage/",
    "public/",
    "src/react-app-env.d.ts",
    "prettier.config.js",
  ],
};
