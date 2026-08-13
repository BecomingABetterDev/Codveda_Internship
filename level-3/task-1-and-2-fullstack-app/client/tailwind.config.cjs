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
                canvas: "#030712", // Ultra-deep slate for the background
                surface: {
                    DEFAULT: "#090D16", // Card backgrounds
                    hover: "#1f2937",
                    muted: "#374151",
                    glass: "rgba(17, 24, 39, 0.7)",
                },
                brand: {
                    DEFAULT: "#6366f1", // Indigo-500
                    hover: "#4f46e5", // Indigo-600
                    glow: "rgba(99, 102, 241, 0.15)",
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