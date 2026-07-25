module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/react",
        "plugin:prettier/recommended",
    ],
    plugins: ["react", "react-hooks", "jsx-a11y", "import", "prettier"],
    rules: {
        // Enforce Prettier formatting as ESLint rule
        "prettier/prettier": ["error"],

        // React / JSX
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",

        // Hooks
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        // Import rules
        "import/no-unresolved": "error",
        "import/order": [
            "warn",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                ],
                "newlines-between": "always",
            },
        ],

        // Best practices
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "error",
        "prefer-const": "warn",
        "no-var": "error",
        eqeqeq: ["error", "always"],

        // Accessibility
        "jsx-a11y/anchor-is-valid": [
            "warn",
            {
                components: ["Link"],
                specialLink: ["to", "hrefLeft", "hrefRight"],
                aspects: ["noHref", "invalidHref", "preferButton"],
            },
        ],

        // Stylistic choices (non-blocking)
        "react/prop-types": "off", // we use TypeScript or rely on PropTypes later; disable for now
    },
    overrides: [{
        files: ["*.ts", "*.tsx"],
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint"],
        extends: ["plugin:@typescript-eslint/recommended"],
    }, ],
};