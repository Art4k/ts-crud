module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "airbnb-typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/quotes": [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "linebreak-style": 0,
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": [2],
    "react/jsx-filename-extension": [0],
    "@typescript-eslint/indent": [0],
  },
};
