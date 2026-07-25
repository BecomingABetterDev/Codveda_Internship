module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
    },
    plugins: ["react", "react-hooks", "jsx-a11y", "import"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    rules: {
        // React hooks rules (manual, since no recommended config in ESLint 6 era)
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        // General hygiene
        "no-console": "warn",
        "no-debugger": "error",
        "eqeqeq": ["error", "always"]
    },
    settings: { react: { version: "detect" } }
};