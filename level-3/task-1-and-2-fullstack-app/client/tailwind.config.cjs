const colors = require("tailwindcss/colors");
module.exports = {
    mode: "jit",
    purge: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                amber: colors.amber,
                emerald: colors.emerald,
                slate: colors.blueGray,
                brand: {
                    DEFAULT: "var(--color-brand)",
                    hover: "var(--color-brand-hover)",
                },
                canvas: "var(--color-canvas)",
                surface: {
                    DEFAULT: "var(--color-surface)",
                    muted: "var(--color-surface-muted)",
                    hover: "var(--color-surface-hover)",
                    glass: "rgba(17, 24, 39, 0.7)",
                },
            },
            boxShadow: {
                glow: "0 0 20px rgba(99, 102, 241, 0.15)",
                glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    variants: {
        extend: {
            opacity: ["disabled"],
            cursor: ["disabled"],
            borderColor: ["focus-within"],
        },
    },
    plugins: [require("@tailwindcss/forms")],
};